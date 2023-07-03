// Copyright 2020 Inrupt Inc.
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal in
// the Software without restriction, including without limitation the rights to use,
// copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the
// Software, and to permit persons to whom the Software is furnished to do so,
// subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,
// INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A
// PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
// HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
// OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
// SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

// This is copied from Pod Browser, and will hopefully make it into the SDK in the future:
// https://github.com/inrupt/pod-browser/blob/a83bb6e824df1447eea38c44e5f796243925ce48/components/login/provider/validateProviderIri.js
import getConfig from "../config";

const config = getConfig();

function joinUrl(baseUrl, appendPath) {
  try {
    const parsedUrl = new URL(baseUrl);
    const path = parsedUrl.pathname;

    parsedUrl.pathname = `${path}${path.endsWith("/") ? "" : "/"}${appendPath}`;

    return parsedUrl.toString();
  } catch {
    return null;
  }
}

export const WELL_KNOWN_OPENID_CONFIG = ".well-known/openid-configuration";

/**
 * Returns the `issuer` URL from the openid configuration from the given `issuer`
 * @returns "invalid_url" | "bad_request" | "unavailable" | "network_error" | URL
 */
export async function validateProviderIri(iri) {
  if (!iri) {
    return Promise.reject("invalid_url");
  }

  const openIdConfigUrl = joinUrl(iri, WELL_KNOWN_OPENID_CONFIG);
  if (!openIdConfigUrl) {
    return Promise.reject("invalid_url");
  }

  return fetch(openIdConfigUrl, {
    headers: { accept: "application/json" },
    mode: "cors",
    credentials: "omit",
    redirect: "follow",
    cache: "no-store",
  })
    .then(async (res) => {
      if (res.ok) {
        try {
          const json = await res.json();
          if (json.issuer) {
            return json.issuer;
          }

          // This is really invalid_provider, but this'll have the same effect
          return Promise.reject("invalid_url");
        } catch {
          return Promise.reject("invalid_url");
        }
      }

      if (res.status >= 500) {
        return Promise.reject("unavailable");
      }

      return Promise.reject("bad_request");
    })
    .catch(() => {
      return Promise.reject("network_error");
    });
}

// Cleaner that doing it inline:
const oneMinute = 1000 * 60;
// iri => { result, fetched }
const validationCache = new Map();

// Pre-prime the cache with the default IdP with a never expiry:
if (config.defaultIdp) {
  validationCache.set(config.defaultIdP, {
    result: Promise.resolve(config.defaultIdp),
    fetched: 0,
  });
}

// Using a cache for validations as we're triggering from onChange:
export function validateProvider(iri) {
  if (
    !validationCache.has(iri) ||
    Date.now() - validationCache.get(iri).fetched > oneMinute
  ) {
    const fetched = Date.now();
    const result = validateProviderIri(iri);

    validationCache.set(iri, {
      fetched,
      result,
    });
  }

  return validationCache.get(iri).result;
}

setInterval(() => {
  validationCache.forEach((value, key) => {
    // If it's 5 minutes old, delete it:
    if (Date.now() - value.fetched > oneMinute * 5) {
      validationCache.delete(key);
    }
  });
}, oneMinute * 2);
