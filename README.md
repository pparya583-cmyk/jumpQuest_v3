# Jump Quest

Game platformer 2D berbasis HTML5 Canvas. Satu `index.html`, satu `game.js`, dan folder `assets/`. Tanpa library, tanpa build, tanpa CDN, tanpa server backend. Semua path relatif, jadi bisa di-host di root domain maupun di sub-path GitHub Pages (`/NAMA-REPO/`).

## Fitur
- 10 world bertema (Green Grassland, Desert, Snow, Lava Cave, Forest, Sky Islands, dst.), 3 bintang per level, boss di world 5 dan 10.
- 4 karakter (beli di Shop), power-up (magnet, boots, shield, wing, clock, mushroom, kunci + gerbang), musuh, jebakan, platform bergerak, air.
- Mission (5 misi bertahap), Daily Reward (streak 7 hari), Settings (musik, efek suara, getar).
- Progres, koin, permata, dan pengaturan tersimpan di `localStorage` (kunci `jq1`).

## Struktur folder
```
/                      <- root repository
├── index.html         halaman game
├── game.js            seluruh logika, UI, audio (WebAudio), level generator
├── .nojekyll          mematikan pemrosesan Jekyll di GitHub Pages
├── README.md
└── assets/            file PNG pixel art (sprite, tile ground g0-g9, background bg0-bg9, hero0-3)
```
Semua gambar dimuat dari `assets/...` (relatif). Jika satu gambar gagal dimuat, game memakai gambar prosedural sebagai cadangan.

## Menjalankan lokal
```
python3 -m http.server 8000
```
Buka `http://localhost:8000`. Membuka `index.html` langsung (`file://`) juga berjalan.

## Deploy ke GitHub Pages (otomatis via GitHub Actions)
Repo ini sudah berisi workflow `.github/workflows/deploy.yml`: setiap push ke branch `main`, GitHub otomatis memeriksa aset + sintaks `game.js`, mem-build, lalu men-deploy ke Pages.

1. Buat repository baru di GitHub (public), misalnya `jump-quest`.
2. Upload **isi** zip (termasuk folder `.github/` dan `.nojekyll`) ke root repository, branch `main`:
   ```
   git init && git add . && git commit -m "Jump Quest"
   git branch -M main
   git remote add origin https://github.com/USERNAME/jump-quest.git
   git push -u origin main
   ```
   (Upload lewat web sering melewatkan folder tersembunyi `.github`; lebih aman pakai git.)
3. Di GitHub: *Settings -> Pages -> Build and deployment -> Source: **GitHub Actions***. (Hanya sekali.)
4. Buka tab *Actions*, tunggu workflow hijau (1-2 menit), lalu buka `https://USERNAME.github.io/jump-quest/`.
5. Jika gagal: lihat log di tab *Actions*. Pesan "Aset hilang" berarti ada file di `assets/` yang tidak ikut ter-upload.

## Build APK Android (otomatis via GitHub Actions)
Workflow `.github/workflows/build-apk.yml` membungkus game dengan Capacitor lalu membangun APK debug (landscape, bisa langsung dipasang).

1. Push ke branch `main` (atau tab *Actions -> Build APK -> Run workflow*).
2. Tunggu job hijau (sekitar 5-10 menit).
3. Buka run tersebut, bagian **Artifacts**, unduh `JumpQuest-apk` (zip berisi `app-debug.apk`).
4. Ekstrak, kirim ke HP, lalu pasang (izinkan *Install unknown apps*).

APK ini ditandatangani dengan debug key: cukup untuk dipasang dan diuji, tetapi tidak bisa diunggah ke Google Play. Untuk Play Store diperlukan build release dengan keystore sendiri.

## Tampilan
Canvas memakai resolusi asli layar (devicePixelRatio) sehingga teks/UI tajam, area game 16:9 berada di tengah, dan sisi layar diisi blur dari tampilan game. APK memakai mode fullscreen immersive + area notch (`scripts/patch-android.py`).

## Aset HD & layar penuh
- `assets_src/` = gambar asli kecil; `python3 scripts/upscale_assets.py` menghasilkan versi halus (4x sprite, 8x background) ke `assets/`. Ukuran logis tetap dari `assets/sizes.json`/`ORIG` di `game.js`.
- Karakter dibuat ulang vektor: `python3 scripts/make_hero.py`.
- Lebar dunia game menyesuaikan rasio layar (800-1100 unit), sehingga background dan dunia memenuhi layar; menu memakai area aman di tengah, HUD dan tombol kontrol menempel ke tepi.

## Kontrol
| Aksi | Keyboard | Layar sentuh |
|---|---|---|
| Gerak kiri / kanan | Panah kiri/kanan atau A / D | Tombol panah kiri/kanan (kiri bawah) |
| Lompat | Spasi, W, atau panah atas (tahan = lebih tinggi) | Tombol panah atas (kanan bawah) |
| Pause / lanjut | Esc atau P | Tombol pause (kanan atas) |
| Kembali dari Mission / Daily / Settings | Esc | Tombol *Back* |

Di HP dalam posisi portrait, tampilan diputar otomatis agar tetap landscape (putar HP ke samping untuk layar penuh). Lompat harus ditekan ulang untuk lompat berikutnya (menahan tombol tidak melompat berulang).

## Catatan hak cipta
- Kode game (`index.html`, `game.js`) tidak memakai library pihak ketiga; tentukan sendiri lisensi yang Anda pakai untuk kode ini (mis. MIT) dan tambahkan file `LICENSE` bila perlu.
- Aset gambar di `assets/` dibuat dari crop otomatis gambar referensi. Beberapa karakter, musuh, dan item **menyerupai karakter milik pihak lain (mis. Nintendo)**, sehingga kepemilikan haknya tidak jelas dan tidak boleh dianggap bebas pakai.
- Aman untuk demo pribadi, belajar, atau prototipe. **Jangan** dirilis secara komersial atau dimonetisasi tanpa mengganti aset yang meragukan dengan aset buatan sendiri atau berlisensi (CC0 / berlisensi jelas). Pemilik repository bertanggung jawab atas aset yang di-publish.
- Tidak ada file suara: semua musik dan efek dihasilkan WebAudio lewat kode.

## Pengujian (ringkas)
Diuji di Chromium (Playwright): `http://` dan `file://`, landscape 1280x720 dan portrait 390x844; semua layar (menu, level, karakter, shop, mission, daily, settings, game, pause, menang, kalah) dan semua 10 world dimuat dan dirender tanpa error console, tanpa 404, dan 118/118 gambar termuat. Lihat batasan pengujian di bawah.

Belum teruji penuh: browser selain Chromium (Safari/iOS, Firefox), perangkat sentuh sungguhan (getar, fullscreen, orientation lock, audio otomatis), dan penyelesaian seluruh level oleh pemain (hanya world 6, 7, 8 yang tamat oleh bot uji; keseimbangan kesulitan dan pertarungan boss belum dinilai).


## Tema Pixel (v12)
Seluruh game kini bertema **pixel art**:
- **Karakter** (4 warna) digambar ulang sebagai sprite pixel 18x26 (9 pose: diam, lari x4, lompat, jatuh, kena, mati) - `scripts/make_hero_pixel.py`.
- **Semua sprite, tile tanah, dan background** dikonversi ke pixel art berpalet terbatas + outline - `scripts/pixelate_assets.py` (sumber asli tetap di `assets_src/`). Jalankan ulang dari root repo: `python3 scripts/pixelate_assets.py` lalu `python3 scripts/make_hero_pixel.py assets`.
- **Render resolusi rendah** (game digambar pada setengah resolusi lalu diperbesar tanpa smoothing), posisi gambar disnap ke grid piksel, kamera bergerak per 2 px.
- **Font bitmap 5x7** bawaan (tanpa CDN/file font), panel/tombol/toggle bergaya pixel bertepi bertingkat.


## v16: font Minecraft + background HD
- Semua teks memakai font bitmap bergaya Minecraft (proporsional, ada garis tepi gelap + bayangan). Datanya ada di `game.js` (`MFW`/`MFD`); sumber desain huruf di `scripts/make_mc_font.py`.
- Background 10 dunia (`assets/hbg0..9.jpg`) kini 2560x1440. Buat ulang dengan `python3 scripts/make_hd_bg.py assets`.

## v17: sprite HD, karakter lebih besar & animasi halus, level lebih mudah
- Koin, bintang, musuh, bos, NPC, gergaji, blok, platform digambar ulang beresolusi tinggi: `python3 scripts/make_sprites_hd.py assets` (jangan jalankan `pixelate_assets.py` lagi, itu akan menimpa sprite HD).
- Karakter digambar vektor dengan animasi lari/lompat/jatuh yang halus (squash & stretch, coyote time, jump buffer). Sprite dunia digambar di lapisan resolusi 2x (`SPL`).
- Rintangan lebih mudah: tangga 3 tinggi, lubang 2-3 petak, paku/gergaji lebih sedikit & lambat, musuh dan bos lebih lambat, hitbox pemain lebih pemaaf.
