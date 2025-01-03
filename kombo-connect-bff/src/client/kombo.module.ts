import { Module } from '@nestjs/common';
import {KomboEmployeeService} from "./kombo-employee-service";
import {HttpModule} from "@nestjs/axios";

@Module({
  imports: [HttpModule],
  providers: [KomboEmployeeService],
  exports: [KomboEmployeeService],
})
export class KomboModule {}
