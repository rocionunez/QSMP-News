const { createApp } = Vue;
const { createRouter, createWebHashHistory } = VueRouter;
const { createStore } = Vuex;

const QSMP_NEWS = [
    { 
        id: 1, 
        titulo: "BOMBAS, BOMBAS Y MÁS BOMBAS.", 
        categoria: "Conflicto", 
        fecha: "24 de Marzo, 2026", 
        contenido: "Se reporta que varias minas explotaron en la zona de The Regime, afectando incluso la fábrica de Q!Tubbo, lo que provocó un fuerte enojo dentro del grupo. Según los reportes, los integrantes del Regime asumieron de inmediato que el ataque venía de The North, debido al contexto reciente entre ambas facciones. Además, al llegar a la zona, Q!Ash también fue informado de que Q!Fit habría sido atacado por The North sin motivo alguno, lo que aumentó todavía más la tensión. A partir de esto, Q!Ash expresó que ya no ve otra opción más que responder con un ataque, señalando que le habían dicho que esto sería una “guerra fría”, pero que la situación ya había ido mucho más allá. Según los reportes, su nuevo plan sería atacar colocando un Wither en la zona rival. Sin embargo, Q!Fit advirtió que en esa casa viven muchas personas y que no todas necesariamente los odian, además de señalar que un ataque de ese nivel provocaría la ira general de todos los habitantes del lugar. Aun así, Q!Ash respondió que nadie en esa casa es inocente." 
    },
    { 
        id: 2, 
        titulo: "¿¿POLLO PODRIDO EN EL KFC DE KATIEB Y MIKE??", 
        categoria: "Conflicto", 
        fecha: "25 de Marzo, 2026", 
        contenido: "Se reporta que la inauguración del KFC en la isla terminó en un completo caos. Según los reportes, la comida habría estado envenenada, provocando que varios habitantes comenzaran a enfermarse durante la apertura. Además, también se informó que el lugar estaba infestado de cucarachas, empeorando aún más la situación y desatando alarma entre los presentes.Por ahora, varios habitantes sospechan que el establecimiento pudo haber sido saboteado por alguien, aunque todavía no se ha identificado al responsable." 
    },
    { 
        id: 3, 
        titulo: "DEATH DUO... ¿No tan DEAD?", 
        categoria: "Relaciones", 
        fecha: "26 de Marzo, 2026", 
        contenido: "Se reporta que Q!Missa encontró dentro de la casa que comparte con Q!Philza un regalo especial con su nombre, el cual además estaba firmado por Q!Philza. Según los reportes, Q!Missa recibió el detalle con mucha emoción, considerándolo un gesto muy bonito y significativo de parte de su compañero. La escena ha llamado la atención de algunos habitantes, quienes la interpretan como una nueva muestra del vínculo cercano y platónico que ambos mantienen dentro de la isla." 
    },
    { 
        id: 4, 
        titulo: "Q!Maxo y Q!Aldo descubren ALGO en SPAWN...", 
        categoria: "Investigación", 
        fecha: "26 de Marzo, 2026", 
        contenido: "Se reporta que Q!Maxo le propuso a Q!Aldo utilizar sus poderes para subir hasta lo más alto de la torre principal del spawn, ubicada en el centro de la isla, con la intención de investigar si ocultaba algo. Según los reportes, Q!Aldo aceptó y usó sus poderes para ascender y ayudar a subir a Q!Maxo. Al llegar a la cima, ambos encontraron una habitación con un botón rojo en el centro, lo que los dejó desconcertados al no entender por qué ese mecanismo se encontraba ahí. De acuerdo con lo observado, el botón fue presionado, aunque aparentemente no ocurrió nada de inmediato. El hallazgo ha despertado curiosidad entre algunos habitantes, quienes ahora se preguntan si el botón realmente no activó nada… o si sus efectos aún no se han manifestado." 
    }
];

// Gestión de Estado Global (Módulo 7 & 8)
const store = createStore({
    state() {
        return {
            user: JSON.parse(localStorage.getItem('qsmp_user')) || null,
            recientes: JSON.parse(localStorage.getItem('qsmp_recientes')) || [],
            comentarios: JSON.parse(localStorage.getItem('qsmp_coments')) || {}
        }
    },
    mutations: {
        SET_USER(state, user) { 
            state.user = user; 
            localStorage.setItem('qsmp_user', JSON.stringify(user)); 
        },
        // Registra las noticias que vio el usuario dinámicamente [cite: 25]
        ADD_RECIENTE(state, noticia) {
            if(!state.recientes.find(n => n.id === noticia.id)) {
                state.recientes.unshift(noticia);
                if(state.recientes.length > 3) state.recientes.pop();
                localStorage.setItem('qsmp_recientes', JSON.stringify(state.recientes));
            }
        },
        // Almacena comentarios posteados [cite: 18]
        ADD_COMENTARIO(state, { noticiaId, comentario }) {
            if(!state.comentarios[noticiaId]) state.comentarios[noticiaId] = [];
            state.comentarios[noticiaId].push(comentario);
            localStorage.setItem('qsmp_coments', JSON.stringify(state.comentarios));
        }
    }
});

// COMPONENTES
const Inicio = {
    computed: {
        // Noticias ordenadas de la última hacia atrás [cite: 22]
        noticias() { return QSMP_NEWS },
        recientes() { return this.$store.state.recientes }
    },
    template: `
        <div>
            <header class="hero-tech text-center">
                <div class="container">
                    <h1 class="display-4 fw-bold">QSMP NEWS</h1>
                    <p class="lead">Cobertura del multiverso. Noticias, eventos, lore y el chismecito que nadie pidió pero todos quieren. </p>
                </div>
            </header>
            <div class="container my-5">
                <div class="row">
                    <div class="col-lg-8">
                        <h4 class="mb-4 fw-bold">Últimas Publicaciones</h4>
                        <div v-for="n in noticias" :key="n.id" class="card card-news mb-4 shadow-sm" @click="$router.push('/noticia/'+n.id)">
                            <div class="card-body p-4">
                                <span class="badge bg-primary mb-2">{{ n.categoria }}</span>
                                <h2 class="h4 fw-bold">[+] {{ n.titulo }}</h2>
                                <p class="text-muted small mb-0">Publicado el {{ n.fecha }}</p>
                            </div>
                        </div>
                    </div>
                    <aside class="col-lg-4">
                        <div class="sidebar-sticky">
                            <div class="p-4 bg-white rounded shadow-sm">
                                <h5 class="fw-bold mb-3">Visto Recientemente</h5>
                                <div v-if="recientes.length === 0" class="small text-muted">Aún no has explorado noticias.</div>
                                <ul class="list-unstyled mb-0">
                                    <li v-for="r in recientes" :key="r.id" class="mb-2 border-bottom pb-2">
                                        <router-link :to="'/noticia/'+r.id" class="text-decoration-none text-dark small">{{ r.titulo }}</router-link>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </aside>
                </div>
            </div>
        </div>
    `
};

const Detalle = {
    data() { return { nuevoComent: "" } },
    computed: {
        noticia() { return QSMP_NEWS.find(n => n.id == this.$route.params.id) },
        coments() { return this.$store.state.comentarios[this.$route.params.id] || [] },
        user() { return this.$store.state.user }
    },
    methods: {
        postear() {
            if(this.nuevoComent.trim()) {
                this.$store.commit('ADD_COMENTARIO', {
                    noticiaId: this.noticia.id,
                    comentario: { autor: this.user.nombre, texto: this.nuevoComent, fecha: new Date().toLocaleDateString() }
                });
                this.nuevoComent = "";
            }
        }
    },
    // Al clickear, se registra en el historial [cite: 24, 25]
    mounted() { if(this.noticia) this.$store.commit('ADD_RECIENTE', this.noticia); },
    template: `
        <div class="container my-5" v-if="noticia">
            <div class="row justify-content-center">
                <div class="col-lg-9">
                    <h1 class="display-5 fw-bold mb-3">{{ noticia.titulo }}</h1>
                    <p class="text-muted">Publicado el {{ noticia.fecha }}</p>
                    <hr class="my-4">
                    <div class="fs-5 lh-lg mb-5">{{ noticia.contenido }}</div>

                    <section class="mt-5 p-4 bg-white rounded shadow-sm">
                        <h4 class="fw-bold mb-4">Comentarios ({{ coments.length }})</h4>
                        <div v-for="(c, i) in coments" :key="i" class="mb-3 pb-3 border-bottom">
                            <div class="d-flex justify-content-between mb-1">
                                <span class="fw-bold text-primary">@{{ c.autor }}</span>
                                <span class="small text-muted">{{ c.fecha }}</span>
                            </div>
                            <p class="mb-0">{{ c.texto }}</p>
                        </div>
                        <div v-if="user" class="mt-4">
                            <h6 class="fw-bold">Escribir un comentario</h6>
                            <textarea v-model="nuevoComent" class="form-control mb-3" rows="3" placeholder="Comparte tu opinión..."></textarea>
                            <button @click="postear" class="btn btn-primary px-4">Publicar</button>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    `
};

const Login = {
    data() { return { nombre: "" } },
    template: `
        <div class="container my-5 py-5">
            <div class="row justify-content-center">
                <div class="col-md-5">
                    <div class="card shadow border-0 p-4">
                        <div class="card-body text-center">
                            <h3 class="fw-bold mb-4">Acceso Usuarios</h3>
                            <input v-model="nombre" class="form-control mb-3" placeholder="Ingresa tu nombre">
                            <button @click="entrar" class="btn btn-primary w-100 py-2 fw-bold">Ingresar</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `,
    methods: { entrar() { if(this.nombre) { this.$store.commit('SET_USER', { nombre: this.nombre }); this.$router.push('/'); } } }
};

// Rutas dinámicas para navegación al detalle [cite: 24]
const router = createRouter({
    history: createWebHashHistory(),
    routes: [
        { path: '/', component: Inicio },
        { path: '/noticia/:id', component: Detalle },
        { path: '/login', component: Login }
    ]
});

const app = createApp({
    computed: { user() { return this.$store.state.user } },
    methods: { logout() { this.$store.commit('SET_USER', null); this.$router.push('/login'); } }
});
app.use(store).use(router).mount('#app');