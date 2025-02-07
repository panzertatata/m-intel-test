import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Put,
  UsePipes,
} from '@nestjs/common';
import { ZodValidationPipe } from 'src/pipe/validation.pipe';
import { BookService } from 'src/service/book.service';
import {
  CreateBookDto,
  createBookSchema,
  DeleteBookDto,
  GetBookDto,
  getBookSchema,
  UpdateBookDto,
  updateBookSchema,
} from './book.controller.validator';

@Controller('book')
export class BookController {
  constructor(private bookService: BookService) {}
  @Get()
  @UsePipes(new ZodValidationPipe(getBookSchema))
  async findAll(@Body() body: GetBookDto) {
    const users = await this.bookService.findAll(body);
    return users;
  }

  @Put()
  @UsePipes(new ZodValidationPipe(createBookSchema))
  async create(@Body() body: CreateBookDto) {
    return await this.bookService.create(body);
  }

  @Post()
  @UsePipes(new ZodValidationPipe(updateBookSchema))
  async update(@Body() body: UpdateBookDto) {
    return await this.bookService.updateById(body);
  }

  @Delete()
  async delete(@Body() body: DeleteBookDto) {
    return await this.bookService.remove(body);
  }
}
