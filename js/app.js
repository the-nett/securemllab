/* SecureML Lab · ODC · Andrés Felipe Segura Suárez · CC BY-NC-SA 4.0 */
(function(){
"use strict";
const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
const esc=s=>s.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");
function toast(t){const e=$("#toast");e.textContent=t;e.style.display="block";clearTimeout(toast.t);toast.t=setTimeout(()=>e.style.display="none",2500)}
function shuffle(a){a=a.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a}

/* ---------- SCORM 1.2 ---------- */
const SCORM={api:null,
  find(w){let n=0;while(w&&!w.API&&w.parent&&w.parent!==w&&n<10){w=w.parent;n++}return w&&w.API?w.API:null},
  init(){try{this.api=this.find(window)||(window.opener&&this.find(window.opener));if(this.api){this.api.LMSInitialize("");const s=this.api.LMSGetValue("cmi.core.lesson_status");if(!s||s==="not attempted")this.set("cmi.core.lesson_status","incomplete")}}catch(e){this.api=null}},
  set(k,v){try{if(this.api){this.api.LMSSetValue(k,String(v));this.api.LMSCommit("")}}catch(e){}},
  get(k){try{return this.api?this.api.LMSGetValue(k):""}catch(e){return""}},
  t0:Date.now(),done:false,
  finish(){if(this.done||!this.api)return;this.done=true;try{
    const s=Math.round((Date.now()-this.t0)/1000),p=n=>String(n).padStart(2,"0");
    this.api.LMSSetValue("cmi.core.session_time",p(Math.floor(s/3600))+":"+p(Math.floor(s%3600/60))+":"+p(s%60));
    const st=this.api.LMSGetValue("cmi.core.lesson_status");
    this.api.LMSSetValue("cmi.core.exit",st==="incomplete"?"suspend":"");
    this.api.LMSCommit("");this.api.LMSFinish("")}catch(e){}}
};

/* ---------- Audio de Byte ---------- */
let audio=null;
function stopAudio(){if(audio){audio.pause();audio=null}$("#byte").classList.remove("talk");$("#btnAudio").textContent="Escuchar audio"}
/* Cada pantalla usa audios/pNN.mp3. Si un guion se generó en dos tramos,
   se reproducen seguidos audios/pNN_parte1.mp3 y audios/pNN_parte2.mp3. */
function playAudio(){
  if(audio){stopAudio();return}
  const n=String(cur+1).padStart(2,"0"),scr=cur;
  function load(src,onFail,onEnd){
    const a=new Audio(src);audio=a;
    a.onplaying=()=>{$("#byte").classList.add("talk");$("#btnAudio").textContent="Detener audio"};
    a.onended=()=>{if(audio===a)onEnd()};
    a.onerror=()=>{if(audio===a&&cur===scr)onFail()};
    a.play().catch(()=>{});
  }
  const none=()=>{stopAudio();toast("Audio de esta pantalla aún no disponible")};
  load("audios/p"+n+".mp3",
    ()=>load("audios/p"+n+"_parte1.mp3",none,
      ()=>load("audios/p"+n+"_parte2.mp3",stopAudio,stopAudio)),
    stopAudio);
}

/* ---------- Pantallas ---------- */
const MENU=[["1. Vulnerabilidades y OWASP",3],["2. ML para la seguridad",5],["3. Inyecciones: SQLi y XSS",8],["4. Grafos y AST",9],["5. Control de acceso",11],["6. Fallas criptográficas",12],["7. Nuevas tendencias",14],["8. Laboratorio SecureML",15],["9. Evaluación final",16],["10. Conclusiones",18]];
const TEMA_IDX={1:3,2:5,3:8,4:9,5:11,6:12,7:14,8:15};

const S=[];
/* P1 */
S.push({crumb:"Inicio",html:`<div class="cover"><h1>SecureML Lab</h1>
<p class="sub">Detección inteligente de vulnerabilidades: Machine Learning aplicado a las familias OWASP críticas</p>
<p class="aut">Andres Felipe Segura Suarez · Especialización en Analítica y Ciencia de Datos · Universidad de Cundinamarca · 2026</p>
<button class="btn fill big" data-go="1">Comenzar</button></div>`});
/* P2 */
S.push({crumb:"Bienvenida",html:`<h1>Bienvenida</h1>
<p>Al finalizar podrás analizar la efectividad de las técnicas de Machine Learning para detectar vulnerabilidades de validación de entradas, control de acceso y manejo criptográfico, a partir de la evidencia científica reciente, para seleccionar enfoques de detección pertinentes en el desarrollo de software seguro.</p>
<p>Dirigido a estudiantes de posgrado de la Universidad de Cundinamarca y a desarrolladores o analistas de seguridad en formación.</p>
<div class="grid g3" style="margin-top:18px">
<div class="box center"><b>Aprende</b><br>8 temas con audio</div>
<div class="box center"><b>Practica</b><br>4 actividades y 1 laboratorio</div>
<div class="box center"><b>Evalúate</b><br>10 preguntas, apruebas con 7</div></div>`});
/* P3 */
S.push({crumb:"Menú",html:`<div class="grid g2 menu" style="max-width:860px;margin-top:6px">
${[0,5,1,6,2,7,3,8,4,9].map(i=>`<a data-go="${MENU[i][1]}"${i>7?' class="gris"':""}>${MENU[i][0]}</a>`).join("")}</div>
<p class="links" style="margin-top:12px"><a data-go="20">Referencias</a>·<a data-go="19">Créditos</a></p>`});
/* P4 */
S.push({crumb:"Tema 1 · OWASP Top 10",html:`<div class="grid g3" style="margin-top:20px">
${[["A01","Pérdida de control de acceso","El sistema deja que un usuario vea o haga cosas para las que no tiene permiso. Ej.: cambiar el número en la URL y ver la factura de otra persona."],
["A02","Fallas criptográficas","Los datos sensibles se protegen con algoritmos débiles o mal configurados. Ej.: guardar contraseñas con MD5."],
["A03","Inyección (SQLi y XSS)","El sistema interpreta datos del usuario como si fueran código. Incluye la inyección SQL (SQLi) y el Cross-Site Scripting (XSS)."]]
.map(c=>`<div class="flip"><div class="in"><div class="f"><b>${c[0]}</b>${c[1]}<p>↻ clic para girar</p></div><div class="b">${c[2]}</div></div></div>`).join("")}</div>
<p class="muted" style="margin-top:14px">Tarjetas que giran: frente con el nombre, reverso con definición y ejemplo</p>`});
/* P5 */
S.push({crumb:"Actividad 1",html:`<h1>Actividad 1. Clasifica la vulnerabilidad</h1><p class="muted">Arrastra cada situación a la familia OWASP que le corresponde.</p>
<div class="grid g3" id="pool">${[["El login acepta ' OR '1'='1 sin contraseña","i"],["Cambio el ID en la URL y veo notas ajenas","c"],["Las contraseñas se guardan con MD5","k"],["Un comentario del foro ejecuta un script","i"],["Un usuario normal entra a /admin","c"],["Los datos de pago viajan sin TLS","k"]].map((c,i)=>`<div class="chip" draggable="true" id="ch${i}" data-k="${c[1]}">${esc(c[0])}</div>`).join("")}</div>
<div class="grid g3" style="margin-top:14px">
<div class="zone" data-k="i"><div class="zt">Inyección</div>Suelta aquí</div>
<div class="zone" data-k="c"><div class="zt">Control de acceso</div>Suelta aquí</div>
<div class="zone" data-k="k"><div class="zt">Criptografía</div>Suelta aquí</div></div>
<div class="actions"><button class="btn fill" id="ver">Verificar</button><button class="btn" id="rei">Reintentar</button></div>
<div class="fb" id="fb"></div>`,init:act1});
/* P6 */
S.push({crumb:"Tema 2 · Machine Learning",html:`<div class="grid g2" style="margin-top:6px">
<div class="col"><h3 style="background:var(--navy)">Enfoque por reglas</h3><ul class="box" style="border-radius:0 0 8px 8px">
<li>+ Rápido y fácil de explicar</li><li>– Solo detecta lo que describen sus reglas</li><li>– Genera falsos positivos</li><li>– No reconoce variantes nuevas</li></ul></div>
<div class="col"><h3 style="background:var(--teal)">Enfoque con Machine Learning</h3><ul class="box t" style="border-radius:0 0 8px 8px">
<li>+ Aprende de miles de ejemplos</li><li>+ Reconoce variantes no vistas</li><li>– Depende de la calidad de los datos</li><li>– Requiere evaluación cuidadosa</li></ul></div></div>
<div class="gloss">Falso positivo: alerta de una falla que no existe. Falso negativo: falla real que no se detecta.</div>
<p class="muted">Fuentes: Ghaffarian y Shahriari (2017); Nong et al. (2025).</p>`});
/* P7 */
const PASOS=[["1 Datos","fragmentos de código etiquetados como vulnerables o seguros (repositorios públicos, bases CVE y CWE)."],["2 Representación","el código se convierte en números, como secuencias de tokens, árboles o grafos."],["3 Modelo","algoritmos clásicos (Random Forest, SVM) o redes profundas (CNN, LSTM, GNN, Transformers)."],["4 Predicción","el modelo indica si un fragmento es vulnerable y de qué tipo."],["5 Evaluación","precisión (de lo que marcó como vulnerable, cuánto lo era), recall (de las vulnerabilidades reales, cuántas encontró) y F1 (equilibrio entre ambas)."]];
S.push({crumb:"Tema 2 · ¿Cómo aprende?",html:`<div class="steps" style="margin-top:10px">${PASOS.map((p,i)=>`<div class="step ${i%2?"t":"n"}" data-i="${i}">${p[0]}</div>`).join("")}</div>
<div class="grid g3" style="margin-top:24px"><div class="box t center"><b>Precisión</b><br>¿Cuánto de lo marcado era real?</div><div class="box t center"><b>Recall</b><br>¿Cuántas reales encontró?</div><div class="box t center"><b>F1</b><br>Equilibrio entre ambas</div></div>
<p class="muted" id="det" style="margin-top:14px">Clic en cada paso para ver un ejemplo</p>`,
init(){$$(".step").forEach(s=>s.onclick=()=>{$$(".step").forEach(x=>x.classList.remove("act"));s.classList.add("act");const p=PASOS[s.dataset.i];const d=$("#det");d.className="detail box";d.innerHTML=`<b>${p[0]}:</b> ${p[1]}`})}});
/* P8 */
const VF=[["1. Un modelo de Machine Learning necesita ejemplos etiquetados para aprender.",true,"Verdadero. Porque el éxito de un modelo depende de la calidad de sus datos. Es imprescindible que aprenda de datos que previamente hayan validado para entrenarlo correctamente."],
["2. Cuando un atacante cambia ligeramente su forma de inyectar SQL, una herramienta basada en reglas definidas igualmente la detecta.",false,"Falso. Una herramienta basada en reglas se limita a la parametrización que le definieron, no puede detectar más allá de lo que explícitamente configuraron."],
["3. En caso de que el código tenga 50 fallas y el modelo detecta 45 tendríamos un recall alto.",true,"Verdadero. Detectó el 90 % de las fallas, eso mide el recall, cuántas fallas reales sí se encontraron."],
["4. Un modelo con 99 % de exactitud siempre es útil en la práctica.",false,"Falso. Si casi todo el código es seguro, un modelo que siempre diga “seguro” también tendría 99 %. Es importante medir al modelo con diferentes métricas."]];
S.push({crumb:"Actividad 2",html:`<h1>Actividad 2. ¿Verdadero o falso?</h1><p class="muted">Marca V o F en cada afirmación y presiona Comprobar.</p>
${VF.map((q,i)=>`<div class="vf" data-i="${i}"><div class="q">${q[0]}</div><button class="v">V</button><button class="fbt">F</button></div><div class="r" id="r${i}"></div>`).join("")}
<div class="actions"><button class="btn fill" id="ver">Comprobar</button><button class="btn" id="rei">Reintentar</button></div>`,init:act2});
/* P9 */
S.push({crumb:"Tema 3 · Inyecciones",html:`<h1>Tema 3. Inyecciones: SQLi y XSS</h1>
<p>La inyección de SQL consiste en ingresar código SQL por un campo de entrada en un sitio web. Cross-Site Scripting (XSS), por otro lado, inyecta JavaScript que se ejecuta en el navegador de otros usuarios.</p>
<div class="tabs"><button class="tab red on" data-t="0">Vulnerable</button><button class="tab" data-t="1">Corregido</button></div>
<pre class="code" id="cd"></pre>
<div class="grid g4" style="margin-top:14px"><div class="box t center">LSTM: lee el código como secuencia</div><div class="box t center">CNN: detecta patrones locales</div><div class="box t center">Transformer: entiende el contexto</div><div class="box t center">Híbridos: reglas + aprendizaje</div></div>
<p class="muted">Fuentes: Hassan et al. (2021); Liu et al. (2023); Lu et al. (2023); Wartschinski et al. (2022).</p>`,
init(){const C=[`<span class="bad">consulta = "SELECT * FROM usuarios WHERE id = '" + id + "'"</span>`,`<span class="good">cursor.execute("SELECT * FROM usuarios WHERE id = %s", (id,))</span>`];
const show=t=>{$$(".tab").forEach(b=>b.classList.toggle("on",b.dataset.t==t));$("#cd").innerHTML=C[t]};$$(".tab").forEach(b=>b.onclick=()=>show(b.dataset.t));show(0)}});
/* P10 */
S.push({crumb:"Tema 4 · Grafos y AST",html:`<h1>Tema 4. Grafos y representaciones del código</h1>
<p>Para entender la estructura del código, muchos estudios lo convierten en árboles de sintaxis abstracta (AST) o en grafos. Las redes neuronales de grafos (GNN) siguen el camino de una entrada del usuario (fuente) hasta una operación peligrosa (sumidero) (N. Guo et al., 2020; Z. Guo et al., 2025; Marashdih et al., 2022; Rabheru et al., 2022).</p>
<div class="flow"><div class="node">Entrada del usuario (fuente)</div><span class="arr">➡</span><div class="node">variable id</div><span class="arr">➡</span><div class="node">concatenación</div><span class="arr">➡</span><div class="node sink">execute() (sumidero)</div></div>
<div class="flow"><div class="rep" style="flex:1">AST</div><div class="rep" style="flex:1">Flujo de control</div><div class="rep" style="flex:1">Flujo de datos</div><div class="rep" style="flex:1">Bytecode / SSA</div><span class="arr">➡</span><div class="node" style="background:var(--teal);flex:1.2">GNN: ¿vulnerable?</div></div>`,
init(){const n=$$(".flow .node");let i=0;anim=setInterval(()=>{n.forEach(x=>x.classList.remove("lit"));n[i%n.length].classList.add("lit");i++},900)}});
/* P11 */
const ML=["LSTM","CNN","GNN","Transformer","Aprendizaje por refuerzo"];
const MR=["Mejora por ensayo, error y recompensa","Aprende sobre grafos como el AST","Lee el código como una secuencia","Usa atención para captar el contexto completo","Detecta patrones locales en fragmentos"];
const MOK={0:2,1:4,2:1,3:3,4:0};
S.push({crumb:"Actividad 3",html:`<h1>Actividad 3. Empareja la técnica con su idea clave</h1><p class="muted">Une cada técnica con la descripción correcta.</p>
<div class="match" id="mt"><svg id="lines"></svg>${ML.map((l,i)=>`<div class="mL" data-i="${i}" style="grid-column:1;grid-row:${i+1}">${l}</div><div class="mR" data-j="${i}" style="grid-column:2;grid-row:${i+1}">${MR[i]}</div>`).join("")}</div>
<div class="actions"><button class="btn fill" id="ver">Verificar</button><button class="btn" id="rei">Reintentar</button></div><div class="fb" id="fb"></div>`,init:act3});
/* P12 */
const PROT={"OAuth 2.0":"La aplicación pide permiso a un servidor de autorización y recibe un token con permisos limitados.","OpenID Connect":"Agrega autenticación sobre OAuth 2.0: confirma quién es el usuario.","ABAC":"Decide el acceso según atributos del usuario, del recurso y del contexto."};
S.push({crumb:"Tema 5 · Control de acceso",html:`<h1>Tema 5. Control de acceso y autenticación</h1>
<p>La autenticación responde «¿quién eres?» y la autorización «¿qué puedes hacer?». Hay una falla cuando la aplicación no verifica bien los permisos. Solo 5 de los 30 estudios revisados abordan esta familia, aunque es la primera del OWASP Top 10.</p>
<div style="display:grid;grid-template-columns:240px 1fr;gap:20px;margin-top:10px">
<div class="login"><div class="center"><b>Iniciar sesión</b></div><input placeholder="Usuario" disabled><input placeholder="Contraseña" type="password" disabled><button class="btn fill" style="width:100%;margin-top:6px">Entrar con OAuth 2.0</button></div>
<div><div class="tabs">${Object.keys(PROT).map((k,i)=>`<button class="tab${i?"":" on"}" data-k="${k}">${k}</button>`).join("")}</div>
<div class="box t" id="pt"></div>
<p style="margin-top:14px">Machine Learning: detecta configuraciones inseguras en OAuth 2.0 (Munonye et al., 2022), estima el riesgo en apps Android (Abdullah et al., 2022) y apoya el control de acceso fino (Akcay et al., 2026).</p></div></div>`,
init(){const sh=k=>{$$(".tab").forEach(b=>b.classList.toggle("on",b.dataset.k===k));$("#pt").textContent=PROT[k]};$$(".tab").forEach(b=>b.onclick=()=>sh(b.dataset.k));sh("OAuth 2.0")}});
/* P13 */
S.push({crumb:"Tema 6 · Criptografía",html:`<h1>Tema 6. Fallas criptográficas</h1>
<p>El problema suele ser cómo se usa la criptografía en el código: algoritmos obsoletos (MD5, SHA-1, DES), claves escritas en el código, números aleatorios inseguros o conexiones sin TLS. 5 de los 30 estudios revisados abordan esta familia.</p>
<div class="grid g2" style="margin-top:12px"><div><b style="color:var(--red)">Riesgoso</b><pre class="code"><span class="bad">hashlib.md5(clave.encode()).hexdigest()</span></pre></div>
<div><b style="color:var(--teal)">Recomendado</b><pre class="code"><span class="good">bcrypt.hashpw(clave.encode(), bcrypt.gensalt())</span></pre></div></div>
<p style="margin-top:16px">Machine Learning: detecta mal uso con AST y clasificadores (Kumar et al., 2025), recomienda algoritmos seguros (Dadiyala et al., 2025), encuentra canales laterales (Drees et al., 2021) y analiza código cifrado (Kim et al., 2026).</p>`});
/* P14 */
const GAPS=[["1. La inyección SQL ocurre cuando una entrada no "," se incluye en una consulta.","validada"],["2. El árbol de sintaxis "," (AST) representa la estructura del código.","abstracta"],["3. OAuth 2.0 es un marco de "," que permite delegar permisos.","autorización"],["4. Guardar contraseñas con MD5 es un ejemplo de mal uso ",".","criptográfico"],["5. Las GNN aprenden sobre "," que representan el código.","grafos"]];
S.push({crumb:"Actividad 4",html:`<h1>Actividad 4. Completa la idea</h1><p class="muted">Arrastra cada palabra al espacio correcto.</p>
<div class="bank">${["validada","abstracta","autorización","criptográfico","grafos"].map(w=>`<div class="chip" draggable="true" data-w="${w}">${w}</div>`).join("")}<button class="btn" id="ver">Verificar</button><button class="btn" id="rei">Reintentar</button></div>
${GAPS.map((g,i)=>`<div class="sent">${g[0]}<span class="gap" data-i="${i}">______</span>${g[1]}</div>`).join("")}
<div class="fb" id="fb"></div>`,init:act4});
/* P15 */
S.push({crumb:"Tema 7 · Tendencias",html:`<div class="grid g3" style="margin-top:20px">
${[["LLM","Modelos de lenguaje grandes","Analizan y explican fragmentos de código; ya se comparan con modelos clásicos para detectar inyección SQL y NoSQL (Maligazhdarova et al., 2025)."],
["RL","Aprendizaje por refuerzo","Agentes que aprenden por ensayo y error a detectar inyección SQL y XSS de forma adaptativa (Xu et al., 2025)."],
["IA gen.","IA generativa","Crea variantes de ataques XSS para poner a prueba las defensas (Khan et al., 2024)."]]
.map(c=>`<div class="flip"><div class="in"><div class="f"><b>${c[0]}</b>${c[1]}<p>↻ clic para girar</p></div><div class="b">${c[2]}</div></div></div>`).join("")}</div>
<p class="muted" style="margin-top:14px">Uso responsable: validación humana · entornos controlados · privacidad del código</p>`});
/* P16 */
const CASOS=[{c:`consulta = f"SELECT * FROM productos\n   WHERE nombre = '{nombre}'"`,r:"Vulnerable · Inyección SQL",p:0.94,pt:"entrada concatenada en la consulta"},
{c:`comentarioDiv.innerHTML = comentarioUsuario;`,r:"Vulnerable · XSS",p:0.89,pt:"texto con innerHtml"},
{c:`token = secrets.token_hex(32)`,r:"Seguro",p:0.07,pt:"token creado con secrets"}];
S.push({crumb:"Tema 8 · Laboratorio",html:`<div style="display:grid;grid-template-columns:1.5fr 1fr;gap:20px;margin-top:6px"><div>
<div class="tabs">${CASOS.map((c,i)=>`<button class="tab${i?"":" on"}" data-c="${i}">Caso ${i+1}</button>`).join("")}</div>
<pre class="code" id="lc"></pre>
<div class="grid g2" style="margin-top:14px"><button class="choice v" data-a="v">Vulnerable</button><button class="choice s" data-a="s">Seguro</button></div></div>
<div class="pred" id="pr"><b>Predicción del modelo</b><p class="muted">Elige Vulnerable o Seguro para ver la predicción.</p></div></div>
<p class="muted" style="margin-top:16px">Nota: los valores son de ejemplo, no salen de un modelo real.</p>`,init:lab});
/* P17-18 evaluación */
const EV=[
{t:"radio",q:"1. ¿En qué categoría del OWASP Top 10 se ubican la inyección SQL y el XSS?",o:["a) Pérdida de control de acceso","b) Inyección","c) Fallas criptográficas","d) Configuración de seguridad incorrecta"],a:1,f:"Desde 2021, la categoría Inyección incluye SQLi y XSS",tema:3},
{t:"radio",q:"2. ¿Las herramientas basadas solo en reglas detectan con facilidad variantes nuevas de un ataque?",o:["Verdadero","Falso"],a:1,f:"Las reglas solo detectan los patrones que describen",tema:2},
{t:"radio",q:"3. ¿Qué métrica indica cuántas de las vulnerabilidades reales encontró el modelo?",o:["a) Precisión","b) Exactitud","c) Recall","d) Pérdida"],a:2,f:"El recall mide cuántas vulnerabilidades reales se encontraron.",tema:2},
{t:"match",q:"4. LSTM, GNN, Transformer con secuencias, grafos, atención",l:["LSTM","GNN","Transformer"],o:["secuencias","grafos","atención"],f:"Cada técnica procesa el código de una forma distinta",tema:4},
{t:"radio",q:"5. ¿Qué representación muestra la estructura del código en forma de árbol?",o:["a) Bytecode","b) Token","c) Registro de eventos","d) AST"],a:3,f:"El AST es el árbol de sintaxis abstracta.",tema:4},
{t:"radio",q:"6. ¿OAuth 2.0 es un marco de autorización que permite delegar permisos?",o:["Verdadero","Falso"],a:0,f:"OAuth 2.0 delega permisos mediante tokens.",tema:5},
{t:"text",q:"7. Guardar contraseñas con ______ es un ejemplo de mal uso criptográfico.",a:"md5",f:"MD5 es un algoritmo obsoleto para contraseñas.",tema:6},
{t:"radio",q:"8. ¿Cuándo es ético usar IA generativa para crear ataques XSS?",o:["a) Nunca","b) En cualquier sitio web público","c) Solo en entornos controlados y con autorización"],a:2,f:"Solo con autorización y en un entorno controlado.",tema:7},
{t:"radio",q:"9. Un estudiante cambia la dirección /notas?id=1024 por /notas?id=1025 y ve las notas de otro compañero. ¿Qué tipo de vulnerabilidad es esa?",o:["a) Inyección","b) Falla criptográfica","c) Configuración de seguridad incorrecta","d) Pérdida de control de acceso"],a:3,f:"La aplicación no verifica que el usuario tenga permiso para ver ese recurso.",tema:5},
{t:"radio",q:"10. comentarioDiv.innerHTML = comentarioUsuario; ¿Qué riesgo presenta?",o:["a) Inyección SQL","b) XSS","c) Falla criptográfica","d) Ninguno"],a:1,f:"Es XSS; se corrige con textContent o escapando la salida.",tema:3}];
let ev={i:0,ok:[],done:false};
S.push({crumb:"Evaluación final (1/2)",html:`<h1>Evaluación final</h1><p class="muted">10 preguntas. Necesitas 7 respuestas correctas para aprobar.</p><div id="evq"></div>`,init:()=>evalInit(0)});
S.push({crumb:"Evaluación final (2/2)",html:`<div id="evq"></div>`,init:()=>evalInit(5)});
/* P19 */
S.push({crumb:"Conclusiones",html:`<h1>Conclusiones</h1><div class="grid g3">
<div class="concl" style="background:var(--navy)">El Machine Learning detecta más que las reglas fijas si aprende de buenos datos y entiende la estructura del código.</div>
<div class="concl" style="background:var(--teal)">Las inyecciones tienen la evidencia más sólida; control de acceso y criptografía son oportunidades de investigación.</div>
<div class="concl" style="background:var(--navy)">Grafos, Transformers y LLM marcan el camino, con validación humana y uso ético.</div></div>
<div class="box t center" style="margin-top:14px">Para reflexionar: ¿qué técnica elegirías para revisar el código de tu próximo proyecto y por qué?</div>
<div class="actions"><button class="btn" data-go="2">Volver al menú</button><button class="btn" data-go="20">Referencias</button><button class="btn" data-go="19">Créditos</button></div>`,
init(){if(ev.done){SCORM.set("cmi.core.lesson_status",score()>=7?"passed":"failed")}else{const st=SCORM.get("cmi.core.lesson_status");if(st!=="passed"&&st!=="failed")SCORM.set("cmi.core.lesson_status","completed")}}});
/* P20 */
S.push({crumb:"Metadatos y créditos",html:`<div class="meta"><h1>METADATOS</h1>
<h4>Área de conocimiento</h4>Desarrollo de software seguro · Analítica y Ciencia de Datos
<h4>Nombre del material</h4>SecureML Lab: detección inteligente de vulnerabilidades con Machine Learning aplicado a las familias OWASP críticas
<h4>Autor</h4>Andres Felipe Segura Suarez<h4>Diseño y desarrollo</h4>Andres Felipe Segura Suarez
<h4>Imágenes</h4>Andres Felipe Segura Suarez (imágenes generadas con IA y de bancos con licencia libre)
<h4>Sonidos y voces</h4>Voz del avatar Byte generada con IA mediante Azure AI Speech de Microsoft (<a href="https://speech.microsoft.com" target="_blank">https://speech.microsoft.com</a>); sin música de fondo.
<h4>Fecha de creación</h4>17/10/2026<h4>Nivel educativo</h4>Intermedio</div>
<div class="box" style="margin-top:16px"><p>Créditos del ODC. Autor, diseño y desarrollo: Andrés Felipe Segura Suárez. Gestor de conocimiento: Jonathan Alejandro Niño Jaramillo. Avatar y voz: Byte, voz generada con IA mediante Azure AI Speech de Microsoft (<a href="https://speech.microsoft.com" target="_blank">https://speech.microsoft.com</a>). Imágenes: generadas con IA y tomadas de bancos con licencia libre, citadas en cada pantalla. Uso de IA: se usó IA generativa como apoyo para estructurar el guion, crear imágenes y generar la voz del avatar; el autor revisó y ajustó todo el contenido. Licencia: Creative Commons BY-NC-SA 4.0.</p></div>`});
/* P21-22 */
const nota=`<p class="muted center" style="margin-top:14px">Todas las referencias siguen la norma APA 7. Los recursos externos usados (íconos e imágenes) tienen licencia libre o fueron generados con IA y se declaran en los créditos.</p>`;
const doi=s=>s.replace(/(https:\/\/\S+[^.\s])/g,'<a href="$1" target="_blank">$1</a>');
S.push({crumb:"Referencias (1/2)",html:`<h1>Referencias (1/2)</h1><div class="refs">${[
"Abdullah, R. M., et al. (2022). Risk calculation of security vulnerabilities on Android applications. <i>Indonesian Journal of Electrical Engineering and Computer Science</i>.",
"Akcay, M. H., et al. (2026). From see to shield: ML-assisted fine-grained access control for visual data. En <i>Proceedings of the ACM Conference on Data and Application Security and Privacy (CODASPY)</i>. ACM.",
"Dadiyala, C., et al. (2025). Cryptographic algorithm identifier with vulnerability detection and recommendations. En <i>IEEE InCoWoCo</i>. IEEE.",
"Drees, J. P., et al. (2021). Automated detection of side channels in cryptographic protocols: DROWN the ROBOTs! En <i>Proceedings of the ACM Workshop on Artificial Intelligence and Security (AISec)</i>. ACM.",
"Ghaffarian, S. M., y Shahriari, H. R. (2017). Software vulnerability analysis and discovery using machine-learning and data-mining techniques: A survey. <i>ACM Computing Surveys, 50</i>(4). https://doi.org/10.1145/3092566",
"Guo, N., et al. (2020). VulHunter: Automated vulnerability detection based on deep learning and bytecode. En <i>Lecture Notes in Computer Science</i>. Springer.",
"Guo, Z., et al. (2025). XSS vulnerability detection based on relationship diagrams. <i>Journal of Web Engineering</i>.",
"Hassan, M. M., et al. (2021). SQL injection vulnerability detection using deep learning: A feature-based approach. <i>Indonesian Journal of Electrical Engineering and Informatics</i>.",
"Khan, S., et al. (2024). LL-XSS: End-to-end generative model-based XSS payload creation. En <i>IEEE Learning and Technology Conference (LT)</i>. IEEE.",
"Kim, S., et al. (2026). PP-Vul: Privacy-preserving vulnerability detection using homomorphic encryption. En <i>Proceedings of the ACM Asia Conference on Computer and Communications Security (ASIA CCS)</i>. ACM.",
"Kumar, S., et al. (2025). Enhancing cryptographic misuse detection using AST and machine learning. En <i>CISCON</i>."].map(r=>`<p>${doi(r)}</p>`).join("")}</div>${nota}`});
S.push({crumb:"Referencias (2/2)",html:`<h1>Referencias (2/2)</h1><div class="refs">${[
"Liu, Z., et al. (2023). MFXSS: An effective XSS vulnerability detection method in JavaScript. <i>Computers &amp; Security</i>.",
"Lu, D., et al. (2023). A semantic learning-based SQL injection attack detection technology. <i>Electronics</i>.",
"Maligazhdarova, N., et al. (2025). Comparative study of machine learning and large language models for SQL and NoSQL injection. En <i>IEEE SIST</i>. IEEE.",
"Marashdih, A. W., et al. (2022). Predicting input validation vulnerabilities based on SSA features and machine learning. <i>Journal of King Saud University – Computer and Information Sciences</i>.",
"Munonye, K., et al. (2022). Machine learning approach to vulnerability detection in OAuth 2.0 authentication and authorization framework. <i>International Journal of Information Security</i>.",
"Nong, Y., et al. (2025). A systematic literature review on automated software vulnerability detection using machine learning. <i>ACM Computing Surveys</i>. https://doi.org/10.1145/3699711",
"OWASP Foundation. (2021). <i>OWASP Top 10:2021</i>. https://owasp.org/Top10/",
"Rabheru, R., et al. (2022). A hybrid graph neural network approach for detecting PHP vulnerabilities. En <i>IEEE Conference on Dependable and Secure Computing (DSC)</i>. IEEE.",
"Wartschinski, L., et al. (2022). VUDENC: Vulnerability detection with deep learning on a natural codebase for Python. <i>Information and Software Technology</i>.",
"Xu, K., et al. (2025). Adaptive XSS vulnerability detection with hierarchical multi-objective reinforcement learning. <i>Computer Networks</i>."].map(r=>`<p>${doi(r)}</p>`).join("")}</div>${nota}`});

/* ---------- Interacciones ---------- */
function fb(ok,tOk,tBad){const f=$("#fb");f.className="fb show "+(ok?"ok":"bad");f.textContent=ok?tOk:tBad}

/* Arrastrar y soltar con respaldo por clic (táctil) */
function dnd(chips,targets,onDrop){
  let sel=null;
  chips.forEach(c=>{c.addEventListener("dragstart",e=>{e.dataTransfer.setData("text",c.id||c.dataset.w);sel=c});
    c.addEventListener("click",()=>{if(sel&&sel!==c&&c.closest(".zone")&&!c.closest(".zone").contains(sel))return;chips.forEach(x=>x.classList.remove("sel"));sel=c;c.classList.add("sel")})});
  targets.forEach(t=>{t.addEventListener("dragover",e=>{e.preventDefault();t.classList.add("over")});
    t.addEventListener("dragleave",()=>t.classList.remove("over"));
    t.addEventListener("drop",e=>{e.preventDefault();t.classList.remove("over");if(sel)onDrop(sel,t);sel=null});
    t.addEventListener("click",e=>{if(sel&&e.target!==sel){onDrop(sel,t);sel.classList.remove("sel");sel=null}})});
}
function act1(){
  const chips=$$("#pool .chip");
  dnd(chips,$$(".zone").concat([$("#pool")]),(c,z)=>{c.classList.remove("ok","bad");z.appendChild(c)});
  $("#ver").onclick=()=>{let all=true;chips.forEach(c=>{const z=c.parentElement;const ok=z.classList.contains("zone")&&z.dataset.k===c.dataset.k;c.classList.toggle("ok",ok);c.classList.toggle("bad",!ok);if(!ok)all=false});
    fb(all,"¡Muy bien! Identificar el tipo de riesgo es el primer paso para elegir cómo detectarlo.","Pregúntate: ¿es un dato tratado como código, un permiso que falta o una protección débil de los datos? Inténtalo de nuevo.")};
  $("#rei").onclick=()=>render(cur);
}
function act2(){
  const ans={};
  $$(".vf").forEach(r=>{const i=r.dataset.i;$$("button",r).forEach(b=>b.onclick=()=>{$$("button",r).forEach(x=>x.classList.remove("on"));b.classList.add("on");ans[i]=b.classList.contains("v")})});
  $("#ver").onclick=()=>{if(Object.keys(ans).length<4){toast("Marca V o F en las cuatro afirmaciones");return}
    VF.forEach((q,i)=>{const r=$("#r"+i);r.style.display="block";const ok=ans[i]===q[1];r.style.color=ok?"var(--teal)":"var(--red)";r.textContent=(ok?"✔ ":"✘ ")+q[2]})};
  $("#rei").onclick=()=>render(cur);
}
function act3(){
  const pairs={};let selL=null;const svg=$("#lines"),mt=$("#mt");
  function draw(){const b=mt.getBoundingClientRect();svg.innerHTML=Object.entries(pairs).map(([i,j])=>{const l=$(`.mL[data-i="${i}"]`).getBoundingClientRect(),r=$(`.mR[data-j="${j}"]`).getBoundingClientRect();
    return `<line x1="${l.right-b.left}" y1="${l.top+l.height/2-b.top}" x2="${r.left-b.left}" y2="${r.top+r.height/2-b.top}" stroke="#11786b" stroke-width="2.5"/>`}).join("")}
  $$(".mL").forEach(e=>e.onclick=()=>{$$(".mL").forEach(x=>x.classList.remove("sel"));selL=e.dataset.i;e.classList.add("sel")});
  $$(".mR").forEach(e=>e.onclick=()=>{if(selL===null){toast("Primero elige una técnica de la izquierda");return}
    for(const k in pairs)if(pairs[k]==e.dataset.j)delete pairs[k];pairs[selL]=+e.dataset.j;$$(".mL").forEach(x=>x.classList.remove("sel","bad"));$$(".mR").forEach(x=>x.classList.remove("bad"));selL=null;draw()});
  window.addEventListener("resize",draw);
  $("#ver").onclick=()=>{let all=Object.keys(pairs).length===5;for(let i=0;i<5;i++){const ok=pairs[i]===MOK[i];if(!ok){all=false;$(`.mL[data-i="${i}"]`).classList.add("bad")}}
    fb(all,"¡Excelente! Reconocer cómo mira el código cada técnica te ayuda a elegirla según el problema.","Pista: piensa en la forma de los datos que procesa cada técnica: secuencia, ventana, grafo, contexto o recompensa.")};
  $("#rei").onclick=()=>render(cur);
}
function act4(){
  const chips=$$(".bank .chip"),gaps=$$(".gap");
  dnd(chips,gaps,(c,g)=>{if(g.dataset.w){const prev=$(`.bank .chip[data-w="${g.dataset.w}"]`);prev&&prev.classList.remove("used")}
    gaps.forEach(x=>{if(x.dataset.w===c.dataset.w){x.dataset.w="";x.textContent="______"}});g.dataset.w=c.dataset.w;g.textContent=c.dataset.w;g.classList.remove("ok","bad");c.classList.add("used")});
  $("#ver").onclick=()=>{let all=true;gaps.forEach((g,i)=>{const ok=g.dataset.w===GAPS[i][2];g.classList.toggle("ok",ok);g.classList.toggle("bad",!ok);if(!ok)all=false});
    fb(all,"¡Correcto! Dominas los conceptos clave de los temas 3 a 6.","Revisa las palabras marcadas en rojo e inténtalo de nuevo.")};
  $("#rei").onclick=()=>render(cur);
}
function lab(){
  let c=0;
  const show=i=>{c=i;$$(".tab").forEach(b=>b.classList.toggle("on",b.dataset.c==i));$("#lc").textContent=CASOS[i].c;$$(".choice").forEach(b=>b.classList.remove("on"));
    $("#pr").innerHTML=`<b>Predicción del modelo</b><p class="muted">Elige Vulnerable o Seguro para ver la predicción.</p>`};
  $$(".tab").forEach(b=>b.onclick=()=>show(+b.dataset.c));
  $$(".choice").forEach(b=>b.onclick=()=>{$$(".choice").forEach(x=>x.classList.remove("on"));b.classList.add("on");const k=CASOS[c];
    $("#pr").innerHTML=`<b>Predicción del modelo</b><br>${k.r}<br>Probabilidad: ${String(k.p).replace(".",",")}<p>Patrón: ${k.pt}</p><div class="bar"><div style="width:0"></div></div>`;
    setTimeout(()=>{const d=$("#pr .bar div");if(d)d.style.width=k.p*100+"%"},30)});
  show(0);
}

/* Evaluación */
function score(){return ev.ok.filter(Boolean).length}
function evalInit(start){
  if(start===0&&(ev.done||ev.i>4))ev={i:0,ok:[],done:false};
  if(start===5&&ev.i<5){ev.i=5}
  evalQ();
}
function evalQ(){
  const box=$("#evq");if(!box)return;
  if(ev.done){evalResult();return}
  const i=ev.i,q=EV[i];let body="";
  if(q.t==="radio")body=`<div class="grid g2" style="margin-top:10px">${q.o.map((o,k)=>`<div class="opt" data-k="${k}">${o}</div>`).join("")}</div>`;
  if(q.t==="text")body=`<p style="margin-top:12px">Respuesta: <input class="ans" id="txt" autocomplete="off"></p>`;
  if(q.t==="match")body=`<div style="margin-top:10px">${q.l.map((l,k)=>`<p>${l} – <select data-k="${k}"><option value="">Elige…</option>${q.o.map((o,m)=>`<option value="${m}">${o}</option>`).join("")}</select></p>`).join("")}</div>`;
  box.innerHTML=`<div class="qh">${esc(q.q)}</div>${body}<div class="prog"><div style="width:${(i+1)*10}%"></div></div>
  <div class="fb" id="efb"></div><div style="text-align:right"><button class="btn fill" id="resp">Responder</button></div>`;
  let pick=null;$$(".opt",box).forEach(o=>o.onclick=()=>{if(box.dataset.lock)return;$$(".opt",box).forEach(x=>x.classList.remove("on"));o.classList.add("on");pick=+o.dataset.k});
  box.dataset.lock="";
  $("#resp").onclick=()=>{
    if(box.dataset.lock){next();return}
    let ok;
    if(q.t==="radio"){if(pick===null){toast("Elige una opción");return}if(i===9)ev.last=pick;ok=pick===q.a;$$(".opt",box)[q.a].classList.add("ok");if(!ok)$$(".opt",box)[pick].classList.add("bad")}
    if(q.t==="text"){const v=$("#txt").value.trim().toLowerCase();if(!v){toast("Escribe tu respuesta");return}ok=v===q.a;$("#txt").disabled=true}
    if(q.t==="match"){const s=$$("select",box);if(s.some(x=>x.value==="")){toast("Completa las tres parejas");return}ok=s.every((x,k)=>+x.value===k);s.forEach(x=>x.disabled=true)}
    ev.ok[i]=ok;box.dataset.lock="1";
    const f=$("#efb");f.className="fb show "+(ok?"ok":"bad");f.textContent=(ok?"✔ ":"✘ ")+q.f;
    $(".prog div",box).style.width=(i+1)*10+"%";
    $("#resp").textContent=i===4?"Siguiente parte":(i===9?"Ver puntaje":"Siguiente pregunta");
  };
  function next(){ev.i++;if(ev.i===5){go(17);return}if(ev.i>=10){ev.done=true;const s=score();SCORM.set("cmi.core.score.raw",s*10);SCORM.set("cmi.core.score.min",0);SCORM.set("cmi.core.score.max",100);SCORM.set("cmi.core.lesson_status",s>=7?"passed":"failed")}evalQ()}
}
function evalResult(){
  if(cur!==17){go(17);return}
  const s=score(),pass=s>=7,q=EV[9];const temas=[...new Set(EV.filter((x,i)=>!ev.ok[i]).map(x=>x.tema))].sort();
  const rep=temas.length?`Te sugerimos repasar: ${temas.map(t=>`<a style="color:var(--teal);cursor:pointer;text-decoration:underline" data-go="${TEMA_IDX[t]}">Tema ${t}</a>`).join(", ")}`:"";
  const opts=q.o.map((o,k)=>`<div class="opt${k===q.a?" ok":(k===ev.last?" bad":"")}">${o}</div>`).join("");
  $("#evq").innerHTML=`<div class="qh">${esc(q.q)}</div><div class="grid g2" style="margin-top:10px">${opts}</div><div class="prog"><div style="width:100%"></div></div>
  <div style="display:flex;gap:20px;align-items:center"><div class="res" style="flex:1">Tu puntaje: ${s}/10<br>${pass?"¡Aprobaste! Cumpliste el resultado de aprendizaje.":"No alcanzaste el puntaje mínimo. Repasa los temas sugeridos e inténtalo de nuevo."}${rep?"<br>"+rep:""}</div>
  <button class="btn" id="retry">Reintentar</button></div>`;
  $("#retry").onclick=()=>{ev={i:0,ok:[],done:false};go(16)};
}

/* ---------- Navegación ---------- */
let cur=0,anim=null;
const AUDIOS=19; /* las pantallas 1 a 19 tienen audio de Byte; 20 a 22 no */
function render(i){
  stopAudio();if(anim){clearInterval(anim);anim=null}
  const s=S[i];$("#crumb").textContent=s.crumb;$("main .content").innerHTML=s.html;
  $("#btnPrev").disabled=i===0;$("#btnNext").disabled=i===S.length-1;
  $("#btnAudio").disabled=i>=AUDIOS;
  $$(".flip",$("main")).forEach(f=>f.onclick=()=>f.classList.toggle("on"));
  if(s.init)s.init();
  $("main").scrollTop=0;
  SCORM.set("cmi.core.lesson_location",i);
}
function go(i){if(i<0||i>=S.length)return;cur=i;render(i)}
window.addEventListener("load",()=>{
  SCORM.init();
  $("#btnPrev").onclick=()=>go(cur-1);$("#btnNext").onclick=()=>go(cur+1);
  $("#btnMenu").onclick=()=>go(2);$("#btnAudio").onclick=playAudio;
  $("main").addEventListener("click",e=>{const t=e.target.closest("[data-go]");if(t)go(+t.dataset.go)});
  const loc=parseInt(SCORM.get("cmi.core.lesson_location"),10);
  go(isNaN(loc)||loc>=16&&loc<=17?(isNaN(loc)?0:16):loc);
});
window.addEventListener("beforeunload",()=>SCORM.finish());
window.addEventListener("pagehide",()=>SCORM.finish());
})();
