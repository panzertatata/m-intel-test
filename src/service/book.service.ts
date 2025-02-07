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
import { Operator } from 'src/enum/operator.enum';

@Injectable()
export class BookService {
  constructor(
    @InjectRepository(Book)
    private bookRepository: Repository<Book>,
  ) {}

  private _transformOperator(operator, value: string | number) {
    switch (operator) {
      case Operator.Exact: {
        return value.toString();
      }
      case Operator.Partial: {
        return Like(`%${value.toString()}%`);
      }
      case Operator.Gte: {
        return MoreThanOrEqual(Number(value));
      }
      case Operator.Lte: {
        return LessThanOrEqual(Number(value));
      }
      case Operator.Range: {
        if (typeof value !== 'string') {
          throw new HttpException(
            {
              message: `operator '${Operator.Range}' support only <number>-<number> format. for Example: 3-8`,
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
    await this.bookRepository.update(storedBook.id, book);
    return storedBook;
  }

  async remove(params: DeleteBookDto): Promise<void> {
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
    await this.bookRepository.delete(params.id);
  }
}
