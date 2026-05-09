import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '@ecom/database';

@Injectable()
export class CategoriesService {
  constructor(private readonly prisma: PrismaService) {}
  async findAll(parentId?: string) {
    return this.prisma.category.findMany({
      where: parentId ? { parentId } : { parentId: null },
      include: {
        children: {
          include: { children: { include: { children: true }, orderBy: { sortOrder: 'asc' } } },
          orderBy: { sortOrder: 'asc' },
        },
        _count: { select: { products: true } },
      },
      orderBy: { sortOrder: 'asc' },
    });
  }

  async findById(id: string) {
    const cat = await this.prisma.category.findUnique({
      where: { id },
      include: {
        parent: { select: { id: true, name: true } },
        children: { orderBy: { sortOrder: 'asc' } },
        categoryAttributes: true,
        _count: { select: { products: true } },
      },
    });
    if (!cat) throw new NotFoundException('Category not found');
    return cat;
  }

  async create(data: {
    name: string; slug: string; parentId?: string;
    sortOrder?: number; isActive?: boolean; description?: string;
    icon?: string; banner?: string; metaTitle?: string; metaDesc?: string;
  }) {
    const existing = await this.prisma.category.findUnique({ where: { slug: data.slug } });
    if (existing) throw new ConflictException('Slug already exists');
    return this.prisma.category.create({ data });
  }

  async update(id: string, data: {
    name?: string; slug?: string; parentId?: string | null;
    sortOrder?: number; isActive?: boolean; description?: string;
    icon?: string; banner?: string; metaTitle?: string; metaDesc?: string;
  }) {
    await this.findById(id);
    if (data.slug) {
      const existing = await this.prisma.category.findFirst({
        where: { slug: data.slug, id: { not: id } },
      });
      if (existing) throw new ConflictException('Slug already exists');
    }
    return this.prisma.category.update({ where: { id }, data });
  }

  async delete(id: string) {
    await this.findById(id);
    const childCount = await this.prisma.category.count({ where: { parentId: id } });
    if (childCount > 0) throw new ConflictException('Cannot delete category with children');
    return this.prisma.category.update({
      where: { id },
      data: { isActive: false },
    });
  }

  async reorder(items: { id: string; sortOrder: number }[]) {
    await this.prisma.$transaction(
      items.map((item) =>
        this.prisma.category.update({
          where: { id: item.id },
          data: { sortOrder: item.sortOrder },
        }),
      ),
    );
    return { success: true };
  }

  async getBreadcrumb(id: string): Promise<{ id: string; name: string; slug: string }[]> {
    const crumbs: { id: string; name: string; slug: string }[] = [];
    let current = await this.prisma.category.findUnique({
      where: { id },
      select: { id: true, name: true, slug: true, parentId: true },
    });

    let depth = 0;
    const MAX_DEPTH = 10;

    while (current && depth < MAX_DEPTH) {
      crumbs.unshift({ id: current.id, name: current.name, slug: current.slug });
      if (!current.parentId) break;
      current = await this.prisma.category.findUnique({
        where: { id: current.parentId },
        select: { id: true, name: true, slug: true, parentId: true },
      });
      depth++;
    }
    return crumbs;
  }
}
