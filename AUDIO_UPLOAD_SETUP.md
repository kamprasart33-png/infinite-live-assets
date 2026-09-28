# Audio upload setup

The dashboard Add Track form uploads MP3, M4A, or WAV files (maximum 50 MB)
directly from the browser to a private S3 compatible bucket. The API then
stores a reference in the existing `tracks.file_url` column. A completed
purchase receives a short lived signed download URL.

Configure these environment variables on the Render API service:

- `AUDIO_S3_ENDPOINT` — HTTPS S3 compatible endpoint (for R2, the account endpoint)
- `AUDIO_S3_REGION` — region, or `auto` for R2
- `AUDIO_S3_BUCKET` — private bucket name
- `AUDIO_S3_ACCESS_KEY_ID` — key with object read/write access
- `AUDIO_S3_SECRET_ACCESS_KEY` — corresponding secret

Configure bucket CORS to allow `PUT` from `https://infiniteaudioarchive.com`
with `Content-Type` as an allowed header. The browser sends the audio directly
to the bucket; the bucket must not be public. Do not put credentials in Netlify
or browser environment variables. Until the Render variables and CORS are set,
the form reports "Audio storage is not configured yet" and does not create
a track.

After deployment, sign in as admin and test with a small audio file. Confirm
the track appears in Music Library, then verify a completed purchase can
download it. An abandoned upload can leave an unreferenced object in the
bucket; periodically remove unreferenced `tracks/` objects.
