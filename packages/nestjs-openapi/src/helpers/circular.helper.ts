/**
 * Helpers for handling circular and forward-reference DTOs in Swagger schemas.
 *
 * The @nestjs/swagger CLI plugin cannot resolve circular references automatically.
 * Use these patterns when DTOs reference each other (e.g., Category → children: Category[]).
 */

/**
 * Returns a lazy type resolver for use in @ApiProperty({ type: () => DtoClass }).
 *
 * Use this when a DTO has a circular or forward reference to another DTO.
 *
 * @example
 * // CategoryDto references itself (tree structure)
 * @ApiProperty({ type: lazyTypeResolver(() => CategoryDto), isArray: true })
 * @ValidateNested({ each: true })
 * @Type(() => CategoryDto)
 * children?: CategoryDto[];
 */
export function lazyTypeResolver<T>(factory: () => new (...args: any[]) => T) {
  return factory;
}

/**
 * Build an @ApiProperty options object for a self-referencing array field.
 *
 * @example
 * @ApiProperty(selfReferenceArrayOptions(() => CategoryDto))
 * children?: CategoryDto[];
 */
export function selfReferenceArrayOptions<T>(factory: () => new (...args: any[]) => T) {
  return {
    type: factory,
    isArray: true,
    required: false,
  };
}

/**
 * Build an @ApiProperty options object for a nullable self-referencing field.
 *
 * @example
 * @ApiProperty(selfReferenceNullableOptions(() => CategoryDto))
 * parent?: CategoryDto | null;
 */
export function selfReferenceNullableOptions<T>(factory: () => new (...args: any[]) => T) {
  return {
    type: factory,
    nullable: true,
    required: false,
  };
}
