import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Repository,
  Like,
  MoreThanOrEqual,
  LessThanOrEqual,
  Between,
} from 'typeorm';
import { Book } from '../entities/book.entity';
import {
  CreateBookDto,
  DeleteBookDto,
  GetBookDto,
  UpdateBookDto,
} from 'src/controller/book.controller.validator';
import { FindingOperator } from 'src/enum/findingOperator.enum';
import { UpdateRemainingOperator } from 'src/enum/updateRemainingOperator.enum';

@Injectable()
export class BookService {
  constructor(
    @InjectRepository(Book)
    private bookRepository: Repository<Book>,
  ) {}

  private _transformOperator(
    operator: FindingOperator,
    value: string | number,
  ) {
    switch (operator) {
      case FindingOperator.Exact: {
        return value.toString();
      }
      case FindingOperator.Partial: {
        return Like(`%${value.toString()}%`);
      }
      case FindingOperator.Gte: {
        return MoreThanOrEqual(Number(value));
      }
      case FindingOperator.Lte: {
        return LessThanOrEqual(Number(value));
      }
      case FindingOperator.Range: {
        if (typeof value !== 'string') {
          throw new HttpException(
            {
              message: `operator '${FindingOperator.Range}' support only <number>-<number> format. for Example: 3-8`,
            },
            HttpStatus.BAD_REQUEST,
          );
        }
        const [min, max] = value.split('-');
        return Between(min, max);
      }
      default: {
        throw new HttpException(
          {
            message: `operator '${operator}' has not been implement.`,
          },
          HttpStatus.BAD_REQUEST,
        );
      }
    }
  }

  private _calRemaining(
    remain: number,
    newValue: number,
    method: UpdateRemainingOperator,
  ) {
    switch (method) {
      case UpdateRemainingOperator.Add: {
        return remain + newValue;
      }
      case UpdateRemainingOperator.Remove: {
        newValue = remain - newValue;
        if (newValue < 0) {
          throw new HttpException(
            {
              message: `The book is not enough`,
            },
            HttpStatus.INTERNAL_SERVER_ERROR,
          );
        }
        return newValue;
      }
      case UpdateRemainingOperator.Replace: {
        return newValue;
      }
      default: {
        throw new HttpException(
          {
            message: `update 'remaining' method has not been implement`,
          },
          HttpStatus.BAD_REQUEST,
        );
      }
    }
  }

  async findAll(params: GetBookDto) {
    const queryObject = Object.entries(params).reduce((acc, [key, value]) => {
      if (typeof value === 'number') {
        if (key !== 'id') {
          throw new HttpException(
            {
              message: `support only key with 'id' that has value type is number `,
            },
            HttpStatus.BAD_REQUEST,
          );
        }
        return {
          ...acc,
          [key]: value,
        };
      } else {
        return {
          ...acc,
          [key]: this._transformOperator(value.operator, value.value),
        };
      }
    }, {});
    return await this.bookRepository.find({
      where: queryObject,
    });
  }

  async findOneById(id: number): Promise<Book | null> {
    return await this.bookRepository.findOneBy({ id });
  }

  async create(books: CreateBookDto) {
    const tempStoredBook: Book[] = [];
    for (const book of books) {
      const storedBook = await this.bookRepository.findOneBy({
        title: book.title,
        genre: book.genre,
        publicationYear: book.publicationYear,
        author: book.author,
      });
      if (storedBook) {
        tempStoredBook.push(storedBook);
      }
    }

    if (tempStoredBook.length > 0) {
      throw new HttpException(
        {
          message: 'book(s) have been created.',
          book: tempStoredBook,
        },
        HttpStatus.CONFLICT,
      );
    }

    const bookInstance = await this.bookRepository.create(books);
    const createdBooks = await this.bookRepository.save(bookInstance);
    return createdBooks;
  }

  async updateById(book: UpdateBookDto) {
    const storedBook = await this.findOneById(book.id);
    if (!storedBook) {
      throw new HttpException(
        {
          message: 'book not found',
          id: book.id,
        },
        HttpStatus.NOT_FOUND,
      );
    }

    const updatedBook = {
      ...storedBook,
      ...book,
      ...(book.remaining && {
        remaining: this._calRemaining(
          storedBook.remaining,
          book.remaining.value,
          book.remaining.operator,
        ),
      }),
    };

    await this.bookRepository.update(storedBook.id, updatedBook);
    return updatedBook;
  }

  async remove(params: DeleteBookDto) {
    const storedBook = await this.findOneById(params.id);
    if (!storedBook) {
      throw new HttpException(
        {
          message: 'book not found',
          id: params.id,
        },
        HttpStatus.NOT_FOUND,
      );
    }
    return await this.bookRepository.delete(params.id);
  }
}
