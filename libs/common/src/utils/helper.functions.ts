import { HttpException, HttpStatus, Logger } from '@nestjs/common';
import { EntityNotFoundError, SelectQueryBuilder } from 'typeorm';

/**
 * Adds pagination to a query builder.
 *
 * @template T - The type of the query builder.
 * @param {SelectQueryBuilder<T>} queryBuilder - The query builder to add pagination to.
 * @param {number} [limit=10] - The maximum number of records to retrieve.
 * @param {number} [skip=0] - The number of records to skip.
 * @returns {SelectQueryBuilder<T>} - The modified query builder with pagination.
 */
export function addPagination<T>(
  queryBuilder: SelectQueryBuilder<T>,
  limit: number = 20,
  skip: number = 0,
): SelectQueryBuilder<T> {
  queryBuilder.take(limit).skip(skip);
  return queryBuilder;
}

/**
 * Adds ordering to a query builder.
 *
 * @template T - The type of the query builder.
 * @param {SelectQueryBuilder<T>} queryBuilder - The query builder to add ordering to.
 * @param {string} [orderBy] - The column to order by.
 * @param {'ASC' | 'DESC'} [order='ASC'] - The order direction.
 * @returns {SelectQueryBuilder<T>} The modified query builder.
 */
export function addOrdering<T>(
  queryBuilder: SelectQueryBuilder<T>,
  orderBy?: string,
  order: 'ASC' | 'DESC' = 'ASC',
): SelectQueryBuilder<T> {
  if (orderBy) {
    const alias = queryBuilder.alias;
    queryBuilder.orderBy(`${alias}.${String(orderBy)}`, order);
  }
  return queryBuilder;
}

/**
 * Logs the error and handles it based on its type.
 * If the error is an instance of HttpException, it is thrown as is.
 * If the error is an instance of EntityNotFoundError, a new HttpException with a 'Entity not found' message and HttpStatus.NOT_FOUND is thrown.
 * For any other error, a new HttpException with an 'Internal server error' message and HttpStatus.INTERNAL_SERVER_ERROR is thrown.
 * @param logger - The logger instance from @nestjs/common used to log the error.
 * @param error - The error object to be logged and handled.
 * @throws HttpException - If the error is an instance of HttpException or EntityNotFoundError.
 */
export function logAndHandleError(logger: Logger, error: any) {
  logger.error(error);

  if (error instanceof HttpException) {
    throw error;
  }

  if (error instanceof EntityNotFoundError) {
    throw new HttpException('Entity not found', HttpStatus.NOT_FOUND);
  }

  if (error.code === '23505') {
    throw new HttpException(`${error.detail}`, HttpStatus.CONFLICT);
  }

  throw new HttpException(
    'Internal server error',
    HttpStatus.INTERNAL_SERVER_ERROR,
  );
}
