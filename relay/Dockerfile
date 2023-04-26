FROM tiangolo/nginx-rtmp:latest

COPY nginx.conf /etc/nginx/nginx.conf

COPY twitch_key twitch_key

COPY youtube_key youtube_key

RUN sed -i s/{TWITCH_STREAM_KEY}/$(cat twitch_key)/g /etc/nginx/nginx.conf

RUN sed -i s/{YOUTUBE_STREAM_KEY}/$(cat youtube_key)/g /etc/nginx/nginx.conf