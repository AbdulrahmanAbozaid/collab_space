import Cookies, { CookieSetOptions } from "universal-cookie";

const cookies = new Cookies();

class CookiesService {
  get(name: string) {
    return cookies.get(name);
  }
  set(name: string, value: string, options?: CookieSetOptions) {
    return cookies.set(name, value, options);
  }
  remove(name: string) {
    return cookies.remove(name);
  }
}

export default new CookiesService();
