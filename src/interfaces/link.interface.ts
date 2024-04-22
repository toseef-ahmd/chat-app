// export interface Link {
//   rel: string; // The relationship type of the link
//   href: string; // The hyperlink reference
//   method: string; // HTTP method (GET, POST, etc.)
// }

import { ApiProperty } from '@nestjs/swagger';

export class Link {
  @ApiProperty({ example: '/users', description: 'Endpoint URL' })
  href: string;

  @ApiProperty({
    example: 'POST',
    description: 'HTTP method used for the endpoint',
  })
  method: string;
}
