/* --- Mostrar Sección --- */
function mostrarSeccion(id){ document.querySelectorAll('section').forEach(sec => sec.classList.remove('active')); document.getElementById(id).classList.add('active'); }
/* --- Propuesta Musical --- */
function propuestaMusical() { fetch('canciones.txt').then(r=>r.text()).then(data=>{ const lineas=data.split('\n').filter(l=>l.trim()!=='');
const random=lineas[Math.floor(Math.random()*lineas.length)]; const partes=random.split('\t'); const artista=partes[0], cancion=partes[1]; const query=encodeURIComponent(artista+' '+cancion);
window.open('https://www.youtube.com/results?search_query='+query,'_blank'); }).catch(err=>alert('No se pudo cargar la lista de canciones: '+err)); }
/* --- Modal Libros --- */
function abrirModal(){ document.getElementById('overlay-libro').style.display='flex'; document.getElementById('ventana-derecha-libro').style.display='block'; }
function cerrarModal(){ document.getElementById('overlay-libro').style.display='none'; document.getElementById('ventana-derecha-libro').style.display='none'; }
/* --- Búsqueda de libros --- */
document.getElementById('buscar-libro-btn').addEventListener('click', async () => { const resultado = document.getElementById('resultado-libro'); resultado.innerHTML = 'Cargando...'; const contenido = document.getElementById('contenido-libro'); try { const response = await fetch('libros.txt'); if(!response.ok) throw new Error('No se pudo cargar el archivo'); const texto = await response.text(); const libros = texto.split('\n').filter(l=>l.trim()!==''); const libroAleatorio = libros[Math.floor(Math.random()*libros.length)]; const partes = libroAleatorio.split('\t'); const autor = partes[0] || ''; const titulo = partes[1] || ''; const sinopsisLocal = partes[2] || 'Sinopsis no disponible'; const bioLocal = partes[3] || 'Bio del autor no disponible'; resultado.innerHTML = `<div class="libro-item"><span class="autor">${autor}</span> - <span class="titulo">${titulo}</span></div>`; contenido.innerHTML = `<h3>${titulo}</h3><p><strong>Autor:</strong> ${autor}</p><p><strong>Sinopsis:</strong> ${sinopsisLocal}</p><p><strong>Bio del autor:</strong> ${bioLocal}</p>`; abrirModal(); } catch(err){ resultado.textContent='Error al cargar el libro'; console.error(err); } });
/* --- Consultorio --- */
const GAS_URL = 'https://script.google.com/macros/s/AKfycbzUxDODbaM54FXwEoWs75qKHrhfwrmHHefxUjSZE_TaO7jmuzpTkRRSKadV-tqaXJvC/exec';
function cargarConsultas() { fetch(GAS_URL).then(res => res.json()).then(resp => { if(resp.status === 'OK'){ const ul = document.getElementById('listaConsultas'); ul.innerHTML=''; resp.consultas.forEach(c => { const li=document.createElement('li'); li.innerHTML=`<strong>${c.nombre} (${c.email}):</strong> ${c.consulta}`; ul.appendChild(li); }); } }).catch(err => console.error('Error cargando consultas:', err)); }
function enviarConsultorio(event){ event.preventDefault(); const form=event.target; const nombre=form.nombre.value.trim(); const email=form.email.value.trim(); const consulta=form.consulta.value.trim(); if(!nombre || !consulta) return alert('Nombre y consulta son obligatorios'); const data = new URLSearchParams({nombre, email, consulta}); fetch(GAS_URL, { method:'POST', headers:{'Content-Type':'application/x-www-form-urlencoded'}, body:data }).then(res => res.json()).then(resp => { if(resp.status==='OK'){ cargarConsultas(); form.reset(); alert('Consulta enviada y almacenada correctamente.'); } else { alert('Error guardando la consulta: '+resp.message); } }).catch(err=>{ console.error(err); alert('Error al enviar la consulta.'); }); }
document.addEventListener('DOMContentLoaded', cargarConsultas);
/* --- Follar --- */
function abrirFollar() { alert('Abrir documento de consentimiento...'); }
/* --- Diccionario Mongólico --- */
function abrirDiccionario() { alert('Abrir diccionario...'); }
function añadirPalabra() { alert('Añadir palabra al diccionario...'); }
