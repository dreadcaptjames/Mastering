/* MasterForge AI v0.7.0 app shell: caches application code only, never user audio. */
const CACHE_NAME='masterforge-shell-v0.7.0';
const APP_SHELL=['./','./index.html','./app.js','./theme.js','./styles.css','./manifest.webmanifest','./assets/icon-192.png','./assets/icon-512.png','./assets/apple-touch-icon.png'];
self.addEventListener('install',event=>{
  event.waitUntil(caches.open(CACHE_NAME).then(cache=>cache.addAll(APP_SHELL)).then(()=>self.skipWaiting()));
});
self.addEventListener('activate',event=>{
  event.waitUntil(Promise.all([caches.keys().then(names=>Promise.all(names.filter(n=>n.startsWith('masterforge-shell-')&&n!==CACHE_NAME).map(n=>caches.delete(n)))),self.clients.claim()]));
});
self.addEventListener('fetch',event=>{
  const request=event.request;
  if(request.method!=='GET')return;
  const url=new URL(request.url);
  if(url.href==='https://cdn.jsdelivr.net/npm/lamejs@1.2.1/lame.min.js'){
    event.respondWith(caches.open(CACHE_NAME).then(async cache=>{
      const stored=await cache.match(request);
      if(stored)return stored;
      const response=await fetch(request);
      if(response.ok||response.type==='opaque')await cache.put(request,response.clone());
      return response;
    }));
    return;
  }
  if(url.origin!==self.location.origin)return;
  if(!url.pathname.startsWith(new URL(self.registration.scope).pathname))return;
  if(request.mode==='navigate'){
    event.respondWith(fetch(request).catch(()=>caches.match('./index.html')));
    return;
  }
  event.respondWith(caches.match(request).then(hit=>hit||fetch(request)));
});
