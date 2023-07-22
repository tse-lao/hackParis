import lighthouse from '@lighthouse-web3/sdk';
import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import { File } from 'multer';
import { join } from 'path';
import { FormService } from '../form/form.service';

export interface FileUpload {
  file: File;
  jwtToken: string;
  address: string;
}

@Injectable()
export class FilesServices {
  constructor(private readonly FormService: FormService) {}

  async uploadContribution(
    json: string,
    token: string,
    address: any,
    apiKey: string,
    tokenID: number,
  ): Promise<string> {
    // Create the uploads directory if it doesn't exist
    const uploadsDir = join(__dirname, '..', 'uploads');
    fs.mkdirSync(uploadsDir, { recursive: true });

    const survey = await this.FormService.getFormById(tokenID);
    const creator = survey.formAdmin;
    // Write the file to a temporary path
    const tempPath = join(uploadsDir, `contribute-${tokenID}.json`);
    fs.writeFileSync(tempPath, json);

    const response = await lighthouse.uploadEncrypted(
      tempPath,
      apiKey,
      address,
      token,
    );

    console.log(response);
    //preferably we have accessControl here based on the status of the tokenID in the contract.
    await lighthouse.shareFile(address, [creator], response.data.Hash, token);
    console.log('shared file with creator of the form');
    fs.unlinkSync(tempPath);

    return response.data.Hash;
  }
}
