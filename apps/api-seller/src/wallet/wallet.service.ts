import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common'
import { prisma, Prisma } from '@ecom/database'
import { RequestWithdrawalDto } from './dto/wallet.dto'
import { buildPaginationMeta, PaginationDto } from '../common/dto/pagination.dto'
import { randomUUID } from 'crypto'

@Injectable()
export class WalletService {
  async getWallet(shopId: string) {
    let wallet = await prisma.wallet.findUnique({
      where: { ownerId_ownerType: { ownerId: shopId, ownerType: 'SHOP' } },
    })

    if (!wallet) {
      wallet = await prisma.wallet.create({
        data: { ownerId: shopId, ownerType: 'SHOP' },
      })
    }

    return wallet
  }

  async creditBalance(
    shopId: string,
    amount: number,
    type: string,
    referenceId?: string,
    description?: string,
  ) {
    const idempotencyKey = `credit_${shopId}_${referenceId ?? randomUUID()}`

    const existing = await prisma.walletTransaction.findUnique({ where: { idempotencyKey } })
    if (existing) return existing

    return prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      const wallet = await tx.wallet.upsert({
        where: { ownerId_ownerType: { ownerId: shopId, ownerType: 'SHOP' } },
        update: { pendingBalance: { increment: amount } },
        create: { ownerId: shopId, ownerType: 'SHOP', pendingBalance: amount },
      })

      return tx.walletTransaction.create({
        data: {
          walletId: wallet.id,
          type: type as
            | 'SALE_CREDIT'
            | 'WITHDRAWAL'
            | 'REFUND_DEBIT'
            | 'PLATFORM_FEE'
            | 'ADJUSTMENT'
            | 'COMMISSION_PAYOUT'
            | 'DEPOSIT',
          amount,
          balanceAfter: Number(wallet.balance) + Number(wallet.pendingBalance),
          referenceId,
          description,
          idempotencyKey,
          status: 'COMPLETED',
        },
      })
    })
  }

  async settleBalance(shopId: string, amount: number) {
    const wallet = await prisma.wallet.findUnique({
      where: { ownerId_ownerType: { ownerId: shopId, ownerType: 'SHOP' } },
    })
    if (!wallet) throw new NotFoundException('Wallet not found')

    if (Number(wallet.pendingBalance) < amount) {
      throw new BadRequestException('Insufficient pending balance')
    }

    return prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      const updated = await tx.wallet.update({
        where: { ownerId_ownerType: { ownerId: shopId, ownerType: 'SHOP' } },
        data: {
          pendingBalance: { decrement: amount },
          balance: { increment: amount },
        },
      })

      return tx.walletTransaction.create({
        data: {
          walletId: wallet.id,
          type: 'DEPOSIT',
          amount,
          balanceAfter: Number(updated.balance),
          description: 'Balance settlement',
          idempotencyKey: `settle_${shopId}_${Date.now()}`,
          status: 'COMPLETED',
        },
      })
    })
  }

  async requestWithdrawal(shopId: string, dto: RequestWithdrawalDto) {
    const wallet = await prisma.wallet.findUnique({
      where: { ownerId_ownerType: { ownerId: shopId, ownerType: 'SHOP' } },
    })
    if (!wallet) throw new NotFoundException('Wallet not found')

    if (Number(wallet.balance) < dto.amount) {
      throw new BadRequestException('Insufficient available balance')
    }

    return prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      const updated = await tx.wallet.update({
        where: { ownerId_ownerType: { ownerId: shopId, ownerType: 'SHOP' } },
        data: { balance: { decrement: dto.amount } },
      })

      const withdrawal = await tx.walletWithdrawal.create({
        data: {
          walletId: wallet.id,
          amount: dto.amount,
          bankName: dto.bankName,
          accountNumber: dto.bankAccountNumber,
          accountHolder: dto.bankAccountName,
          note: dto.note,
        },
      })

      await tx.walletTransaction.create({
        data: {
          walletId: wallet.id,
          type: 'WITHDRAWAL',
          amount: -dto.amount,
          balanceAfter: Number(updated.balance),
          referenceId: withdrawal.id,
          description: 'Withdrawal request',
          idempotencyKey: `withdraw_${withdrawal.id}`,
          status: 'PENDING',
        },
      })

      return withdrawal
    })
  }

  async listTransactions(shopId: string, query: PaginationDto) {
    const { page = 1, limit = 20 } = query

    const wallet = await prisma.wallet.findUnique({
      where: { ownerId_ownerType: { ownerId: shopId, ownerType: 'SHOP' } },
    })
    if (!wallet) return { data: [], meta: buildPaginationMeta(1, limit, 0) }

    const where: Prisma.WalletTransactionWhereInput = { walletId: wallet.id }

    const [transactions, total] = await Promise.all([
      prisma.walletTransaction.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.walletTransaction.count({ where }),
    ])

    return { data: transactions, meta: buildPaginationMeta(page, limit, total) }
  }

  async listWithdrawals(shopId: string, query: PaginationDto) {
    const { page = 1, limit = 20 } = query

    const wallet = await prisma.wallet.findUnique({
      where: { ownerId_ownerType: { ownerId: shopId, ownerType: 'SHOP' } },
    })
    if (!wallet) return { data: [], meta: buildPaginationMeta(1, limit, 0) }

    const where: Prisma.WalletWithdrawalWhereInput = { walletId: wallet.id }

    const [withdrawals, total] = await Promise.all([
      prisma.walletWithdrawal.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.walletWithdrawal.count({ where }),
    ])

    return { data: withdrawals, meta: buildPaginationMeta(page, limit, total) }
  }
}
