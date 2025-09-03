// import { ApiResponseProperty } from "@nestjs/swagger"

export class HistoryDataDto {
    // @ApiResponseProperty({
    //     example: 1
    // })
    year:number 

    // @ApiResponseProperty({
    //     example: 1
    // })
    month:number
    
    // @ApiResponseProperty({
    //     example: 1
    // })
    day?:number 
    
    // @ApiResponseProperty({
    //     example: 1
    // })
    users?:number 
    
    // @ApiResponseProperty({
    //     example: 1
    // })
    tickets?:number 
    
    // @ApiResponseProperty({
    //     example: 1
    // })
    resolved?:number 
    
    // @ApiResponseProperty({
    //     example: 1
    // })
    unresolved?:number 
}
