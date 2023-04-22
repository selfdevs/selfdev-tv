export function streamLocalFileCommand(file: string): string[] {
  return `-re -i ${file} -an -c:v libx264 -f mpegts udp://127.0.0.1:4001?pkt_size=1316`.split(
    ' ',
  );
}
