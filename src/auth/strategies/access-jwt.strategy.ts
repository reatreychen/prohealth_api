import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { cookieExtractor } from './cookie-extractor';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'access-jwt') {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        cookieExtractor,
      ]),
      ignoreExpiration: false,
      secretOrKey: 'fassfaf',
    });
  }

  async validate(payload: any) {
    return { id: payload.sub };
  }
}
