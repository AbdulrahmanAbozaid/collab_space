import { useEffect, useState } from "react";
// @ts-ignore
import { io, Socket } from "socket.io-client";

/**
 * One socket for the whole page. Returned as STATE (not a ref) so children
 * re-render once it exists, and it is disconnected on unmount.
 */
// @ts-ignore
export function useSocket(url: string): Socket | null {
  // @ts-ignore
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    const s = io(url);
    setSocket(s);
    return () => {
      s.disconnect();
      setSocket(null);
    };
  }, [url]);

  return socket;
}
