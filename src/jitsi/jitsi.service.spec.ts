import { Test, TestingModule } from '@nestjs/testing';

import { JitsiService } from './jitsi.service';

describe('JitsiService', () => {
  let service: JitsiService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [JitsiService],
    }).compile();

    service = module.get<JitsiService>(JitsiService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
