/*
  Copyright (C) 2023 Lowdefy, Inc
  Use of this software is governed by the Business Source License included in the LICENSE file and at www.mariadb.com/bsl11.

  Change Date: 2027-10-09

  On the date above, in accordance with the Business Source License, use
  of this software will be governed by the Apache License, Version 2.0.
*/

// TODO: Better name needed here maybe?
function logRequest({ context }) {
  const { headers = {}, user = {} } = context;
  context.logger.info({
    // TODO:
    // app_name
    // app_version
    // lowdefy_version
    // build_hash
    // config_hash
    user: {
      id: user.id,
      roles: user.roles,
      sub: user.sub,
      session_id: user.session_id, // TODO: Implement session id
    },
    url: context.req.url,
    method: context.req.method,
    resolvedUrl: context.nextContext?.resolvedUrl,
    hostname: context.req.hostname,
    headers: {
      'accept-language': headers['accept-language'],
      'sec-ch-ua-mobile': headers['sec-ch-ua-mobile'],
      'sec-ch-ua-platform': headers['sec-ch-ua-platform'],
      'sec-ch-ua': headers['sec-ch-ua'],
      'user-agent': headers['user-agent'],
      host: headers.host,
      referer: headers.referer,
      'x-forward-for': headers['x-forward-for'],
      // Vercel headers
      'x-vercel-id': headers['x-vercel-id'],
      'x-real-ip': headers['x-real-ip'],
      'x-vercel-ip-country': headers['x-vercel-ip-country'],
      'x-vercel-ip-country-region': headers['x-vercel-ip-country-region'],
      'x-vercel-ip-city': headers['x-vercel-ip-city'],
      'x-vercel-ip-latitude': headers['x-vercel-ip-latitude'],
      'x-vercel-ip-longitude': headers['x-vercel-ip-longitude'],
      'x-vercel-ip-timezone': headers['x-vercel-ip-timezone'],
      // Cloudflare headers
      'cf-connecting-ip': headers['cf-connecting-ip'],
      'cf-ray': headers['cf-ray'],
      'cf-ipcountry': headers['cf-ipcountry'],
      'cf-visitor': headers['cf-visitor'],
    },
  });
  // TODO:
  // Next local? nextContext.locale, nextContext.locales, nextContext.defaultLocale
}

export default logRequest;
