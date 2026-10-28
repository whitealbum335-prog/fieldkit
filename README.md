# Fieldkit

Fieldkit is a static, browser-based defensive security toolbox. It has no build step, package dependencies, or server-side code.

## Interface

Use **Find a tool** in the navigation to filter tools locally; press Enter to open the first match. The theme button switches between dark and light mode for the current page view.

The interface is optimized for desktop screens and adapts its navigation and cards to narrower windows so content remains readable.
The dark theme uses a restrained neon/cyberpunk palette with an illustrated night skyline, futuristic roadway traffic, and flying vehicles. Animations honor the operating system's `prefers-reduced-motion` setting.

## Run locally

Open `index.html` in a modern browser. For clipboard and Web Crypto features, use a secure context such as `https://` or `http://localhost`. To serve it locally with Python, run `python -m http.server 8000` in the project folder and visit `http://localhost:8000`.

## Tools

- Local password strength estimate and cryptographically random password generator
- Local SHA-256 hashing and Base64, URL-component, and hex conversions
- IPv4 CIDR subnet calculator
- Public domain-registration lookup for registrar, registration/expiry dates, nameservers, DNSSEC, and status
- Opt-in connection snapshot with public IP, provider, ASN, broad region, and time zone
- Local browser privacy snapshot for secure-context status, cookies, privacy preference, language, time zone, and screen size
- Public IPv4 allocation lookup through the public RDAP service at `rdap.org`
- Offline reference for common service ports
- Local Gmail address format check, official Google account security links, and a direct, user-initiated Have I Been Pwned account-search handoff with manual result guidance
- Compromised-password check through Have I Been Pwned's free Pwned Passwords range API
- Local-only username reuse audit with presets for popular services; it compares only accounts the user adds
- Locally searchable directory of curated account-safety, domain/network, privacy, and defensive-learning resources

Password generation, strength estimation, hashing, encoding, subnet, browser-detail, Gmail address-format, and username-reuse features run locally. Username audit entries are temporary in-memory data, not saved or sent; the app compares only accounts the user adds and does not search platforms. The compromised-password check hashes the password locally with SHA-1, sends only the first five hash characters to the free [Have I Been Pwned Pwned Passwords range API](https://haveibeenpwned.com/Passwords) over HTTPS, and matches the returned suffixes locally. The password itself and full hash are not sent; the field is cleared after the check. The hash prefix is still sent to HIBP, which may log requests. A match reports only an occurrence count, not the password's breach sources; a non-match does not guarantee safety. The check is not an email-breach lookup.

The Resources directory is a curated list inspired by [OSINT Catalog](https://osint-catalog.org/). Its search and category filters run locally. It links to selected account-safety, public technical metadata, privacy, and defensive-learning resources; outbound sites have their own terms and privacy practices. Fieldkit does not reproduce the catalog's people-search or account-enumeration workflows.

The Gmail self-audit creates a direct link to the official [Have I Been Pwned](https://haveibeenpwned.com/) account page for an address entered by the user. Clicking that link sends the address to HIBP and can expose it in browser history or service logs; Fieldkit does not receive results, and the user manually records a broad result category for local next-step guidance. HIBP's email search API requires an API key, so Fieldkit does not call it or claim automated results. The connection snapshot sends a request to [ipwho.is](https://ipwho.is/), which can see the visitor's public IP and may log requests; it runs only after the visitor clicks its button. The manual IP allocation and domain registration lookups send the entered value to [rdap.org](https://rdap.org/), which routes requests to public registration data services. Those services may log requests and apply terms or rate limits. No API keys are used.

IP region results are approximate, domain registration data can be incomplete, and browser checks are informational. Fieldkit does not retrieve personal registrant contact information or leaked records, access email inboxes, enumerate accounts, test VPN, proxy, DNS, or WebRTC leaks; identify people; scan hosts; or create credential-guessing wordlists. It does not claim that a privacy score can guarantee safety or anonymity.

## Publish with GitHub Pages

1. Create a GitHub repository and add the project files at the repository root: `index.html`, `styles.css`, `app.js`, and `README.md`.
2. In the repository, open **Settings → Pages**.
3. Under **Build and deployment**, choose **Deploy from a branch**.
4. Select the `main` branch and `/(root)`, then save.
5. Wait for the Pages deployment and open the URL shown in the Pages settings.

The site uses relative asset paths and works from a GitHub Pages project URL. There is no build command or secret configuration. Never commit API keys, passwords, or other secrets. Choose and add a license before allowing others to reuse the code.

























Fieldkit
Fieldkit, statik ve tarayıcı tabanlı bir savunma güvenliği araç kutusudur. Derleme adımı, paket bağımlılığı veya sunucu tarafında çalışan kod içermez.
Arayüz
Araçları yerel olarak filtrelemek için gezinme bölümündeki Find a tool alanını kullanın; ilk eşleşen aracı açmak için Enter’a basın. Tema düğmesi, geçerli sayfa görünümünü koyu ve açık modlar arasında değiştirir.

Arayüz masaüstü ekranlar için optimize edilmiştir. İçeriğin okunabilir kalması için dar pencerelerde gezinme ve kart düzeni uyum sağlar. Koyu tema; neon ve siberpunk esintili, ölçülü bir renk paleti, çizim tarzında bir gece silüeti, fütüristik yollarda ilerleyen trafik ve uçan araçlar kullanır. Animasyonlar, işletim sisteminin prefers-reduced-motion ayarına uyar.
Yerel olarak çalıştırma
index.html dosyasını modern bir tarayıcıda açın. Pano ve Web Crypto özellikleri için https:// veya http://localhost gibi güvenli bir bağlam kullanın. Python ile yerel sunucu başlatmak için proje klasöründe python -m http.server 8000 komutunu çalıştırıp http://localhost:8000 adresini ziyaret edin.
Araçlar
- Yerel parola gücü tahmini ve kriptografik olarak rastgele parola oluşturucu
- Yerel SHA-256 karma değeri hesaplama ile Base64, URL bileşeni ve onaltılık biçim dönüştürme
- IPv4 CIDR alt ağ hesaplayıcısı
- Kayıt kuruluşu, kayıt ve sona erme tarihleri, ad sunucuları, DNSSEC ve durum bilgileri için herkese açık alan adı kayıt sorgusu
- Kullanıcı isteğiyle çalışan; herkese açık IP’yi, sağlayıcıyı, ASN’yi, genel bölgeyi ve saat dilimini gösteren bağlantı özeti
- Güvenli bağlam durumu, çerezler, gizlilik tercihi, dil, saat dilimi ve ekran boyutunu gösteren yerel tarayıcı gizliliği özeti
- Herkese açık RDAP hizmeti rdap.org üzerinden IPv4 tahsis sorgusu
- Yaygın hizmet portları için çevrimdışı başvuru kaynağı
- Yerel Gmail adres biçimi denetimi, Google’ın resmî hesap güvenliği bağlantıları ve kullanıcı tarafından başlatılan Have I Been Pwned hesap sorgusuna yönlendirme; sonuçları değerlendirmek için elle girilen rehberlik
- Have I Been Pwned’ın ücretsiz Pwned Passwords aralık API’si üzerinden ele geçirilmiş parola denetimi
- Popüler hizmetler için hazır ayarlar içeren, yalnızca yerel çalışan kullanıcı adı tekrar kullanımı denetimi; yalnızca kullanıcının eklediği hesapları karşılaştırır
- Hesap güvenliği, alan adı ve ağ, gizlilik ve savunma amaçlı öğrenme kaynaklarından oluşan; yerel olarak aranabilen seçki
Parola oluşturma ve güç tahmini, karma hesaplama, kodlama, alt ağ, tarayıcı ayrıntıları, Gmail adres biçimi ve kullanıcı adı tekrar kullanımı özellikleri yerel olarak çalışır. Kullanıcı adı denetimi girdileri geçicidir; bellekte tutulur, kaydedilmez veya gönderilmez. Uygulama yalnızca kullanıcının eklediği hesapları karşılaştırır ve platformlarda arama yapmaz.

Ele geçirilmiş parola denetiminde parola, yerel olarak SHA-1 ile özetlenir. Ardından HTTPS üzerinden ücretsiz Have I Been Pwned Pwned Passwords aralık API’sine yalnızca ilk beş karma karakteri gönderilir; dönen son ekler yerel olarak karşılaştırılır. Parolanın kendisi ve tam karma değeri gönderilmez. Denetimden sonra alan temizlenir. Yine de karma öneki HIBP’ye gönderilir ve istekler kaydedilebilir. Eşleşme varsa yalnızca görülme sayısı bildirilir; parolanın hangi veri ihlallerinde yer aldığı belirtilmez. Eşleşme olmaması, parolanın güvenli olduğunu garanti etmez. Bu denetim, e-posta adreslerinin veri ihlallerinde yer alıp almadığını sorgulamaz.

Kaynaklar dizini, OSINT Catalog’dan esinlenen seçilmiş bir listedir. Arama ve kategori filtreleri yerel olarak çalışır. Dizin; hesap güvenliği, herkese açık teknik üst veriler, gizlilik ve savunma amaçlı öğrenme kaynaklarına bağlantı verir. Harici sitelerin kendi kullanım koşulları ve gizlilik uygulamaları vardır. Fieldkit, kataloğun kişi arama veya hesap listeleme iş akışlarını yeniden sunmaz.

Gmail öz denetimi, kullanıcının girdiği adres için resmî Have I Been Pwned hesap sayfasına doğrudan bağlantı oluşturur. Bu bağlantıya tıklamak adresi HIBP’ye gönderir ve adres tarayıcı geçmişinde veya hizmet günlüklerinde görünebilir. Fieldkit sonuçları almaz; kullanıcı, sonraki adımlara yönelik yerel rehberlik için genel bir sonuç kategorisini elle kaydeder. HIBP’nin e-posta arama API’si API anahtarı gerektirir; bu nedenle Fieldkit API’yi çağırmaz ve otomatik sonuç aldığını iddia etmez.

Bağlantı özeti, yalnızca ziyaretçi düğmesine tıkladıktan sonra ipwho.is adresine istek gönderir. Bu hizmet ziyaretçinin herkese açık IP’sini görebilir ve istekleri kaydedebilir. Elle başlatılan IP tahsisi ve alan adı kayıt sorguları, girilen değeri herkese açık kayıt verisi hizmetlerine yönlendiren rdap.org adresine gönderir. Bu hizmetler istekleri kaydedebilir ve kullanım koşulları ya da hız sınırları uygulayabilir. API anahtarı kullanılmaz.

IP bölgesi sonuçları yaklaşık değerlerdir; alan adı kayıt verileri eksik olabilir ve tarayıcı denetimleri yalnızca bilgilendirme amaçlıdır. Fieldkit; kayıt sahibi kişilerin iletişim bilgilerini veya sızdırılmış kayıtları almaz, e-posta gelen kutularına erişmez, hesapları listelemez, VPN, proxy, DNS ya da WebRTC sızıntılarını test etmez, kişileri belirlemez, sunamaları taramaz ve kimlik bilgisi tahmininde kullanılacak sözcük listeleri oluşturmaz. Bir gizlilik puanının güvenliği veya anonimliği garanti edebileceğini iddia etmez.
GitHub Pages ile yayımlama
1. Bir GitHub deposu oluşturun ve proje dosyalarını deponun kök dizinine ekleyin: index.html, styles.css, app.js ve README.md.
2. Depoda Settings → Pages bölümünü açın.
3. Build and deployment altında Deploy from a branch seçeneğini seçin.
4. main dalını ve /(root) dizinini seçip kaydedin.
5. Pages dağıtımının tamamlanmasını bekleyin ve Pages ayarlarında gösterilen URL’yi açın.
Site göreli dosya yolları kullanır ve GitHub Pages proje URL’si üzerinden çalışır. Derleme komutu veya gizli yapılandırma gerekmez. API anahtarlarını, parolaları veya başka gizli bilgileri asla depoya göndermeyin. Başkalarının kodu yeniden kullanmasına izin vermeden önce bir lisans seçip ekleyin.
