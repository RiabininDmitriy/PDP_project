export class LoginUserDto {
  username: string;
  password: string;
}

// import { ApiProperty } from '@nestjs/swagger';
// import { BookStatus } from '@shared/constants/user-book/book-status';
// import { BookDto } from '@shared/domains/library/book/dto/book.dto';
// import { Type } from 'class-transformer';
// import { IsEnum, ValidateNested } from 'class-validator';
// import { UpdateUserBookDetailsDto } from '@shared/domains/book-tracker/book-details/dto/update-user-book-details.dto';
// export class SearchedBookAndBookDetailsAndStatusDto {
//   @ApiProperty({ enum: BookStatus })
//   @IsEnum(BookStatus)
//   status: BookStatus;
//   /**
//    * Data about the book that was searched and needs to be saved
//    * along the status of that book
//    */
//   @ApiProperty()
//   @ValidateNested()
//   @Type(() => BookDto)
//   searchedBook: BookDto;
//   /**
//    * Details of the book that were found
//    */
//   @ApiProperty()
//   @ValidateNested()
//   @Type(() => UpdateUserBookDetailsDto)
//   details?: UpdateUserBookDetailsDto;
// }
