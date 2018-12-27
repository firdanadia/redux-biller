import * as request from 'request';

import { Emulator } from './emulator';

export class DatabaseEmulator extends Emulator {
  namespace: string;

  constructor(port = 8088, namespace = 'test-emulator') {
    super(port);
    this.namespace = namespace;
    this.binaryName = 'database-emulator.jar';
    // Use locked version of emulator for test to be deterministic.
    // The latest version can be found from database emulator doc:
    // https://firebase.google.com/docs/database/security/test-rules-emulator
    this.binaryUrl =
      'https://storage.googleapis.com/firebase-preview-drop/emulator/firebase-database-emulator-v3.5.0.jar';
  }

  setPublicRules(): Promise<number> {
    console.log('Setting rule {".read": true, ".write": true} to emulator ...');
    return new Promise<number>((resolve, reject) => {
      request.put(
        {
          uri: `http://localhost:${this.port}/.settings/rules.json?ns=${
            this.namespace
          }`,
          headers: { Authorization: 'Bearer owner' },
          body: '{ "rules": { ".read": true, ".write": true } }'
        },
        (error, response, body) => {
          if (error) reject(error);
          console.log(`Done setting public rule to emulator: ${body}.`);
          resolve(response.statusCode);
        }
      );
    });
  }
}
