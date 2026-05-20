/**
 * balatro.js
 * Injeta um canvas WebGL como fundo animado para o tema Balatro.
 * Expõe window.__themeCleanup() para o theme-changer.js remover tudo ao trocar de tema.
 *
 * ── Configuração ──────────────────────────────────────────────────────────────
 * Edite os valores abaixo para mudar as cores e o comportamento do efeito.
 */
(function () {

    /* ── Parâmetros do efeito ── */
    const CFG = {
        colour1:     [0.871, 0.267, 0.231],   // vermelho
        colour2:     [0.0,   0.42,  0.706],   // azul
        colour3:     [0.086, 0.137, 0.145],   // fundo escuro
        spinRotation: -2.0,
        spinSpeed:     7.0,
        contrast:      3.5,
        lighting:      0.4,
        spinAmount:    0.25,
        pixelFilter:   745.0,
    };

    /* ── Vertex Shader ── */
    const VS = `
        attribute vec2 a_pos;
        void main() { gl_Position = vec4(a_pos, 0.0, 1.0); }
    `;

    /* ── Fragment Shader (port fiel do original) ── */
    const FS = `
        precision highp float;

        uniform vec2  u_res;
        uniform float u_time;
        uniform vec3  u_c1;
        uniform vec3  u_c2;
        uniform vec3  u_c3;
        uniform float u_contrast;
        uniform float u_lighting;
        uniform float u_spinAmount;
        uniform float u_spinRotation;
        uniform float u_spinSpeed;
        uniform float u_pixelFilter;

        #define SPIN_EASE 1.0

        vec4 effect(vec2 screenSize, vec2 coord) {
            float pixel_size = length(screenSize) / u_pixelFilter;
            vec2 uv = (floor(coord / pixel_size) * pixel_size - 0.5 * screenSize) / length(screenSize);
            float uv_len = length(uv);

            float speed = u_spinRotation * SPIN_EASE * 0.2 + 302.2;
            float angle = atan(uv.y, uv.x) + speed
                        - SPIN_EASE * 20.0 * (u_spinAmount * uv_len + (1.0 - u_spinAmount));

            vec2 mid = (screenSize / length(screenSize)) * 0.5;
            uv = vec2(uv_len * cos(angle) + mid.x,
                      uv_len * sin(angle) + mid.y) - mid;

            uv *= 30.0;
            float t  = u_time * u_spinSpeed;
            vec2 uv2 = vec2(uv.x + uv.y);

            for (int i = 0; i < 5; i++) {
                uv2 += sin(max(uv.x, uv.y)) + uv;
                uv  += 0.5 * vec2(cos(5.1123314 + 0.353 * uv2.y + t * 0.131121),
                                  sin(uv2.x - 0.113 * t));
                uv  -= cos(uv.x + uv.y) - sin(uv.x * 0.711 - uv.y);
            }

            float cm      = 0.25 * u_contrast + 0.5 * u_spinAmount + 1.2;
            float paint   = min(2.0, max(0.0, length(uv) * 0.035 * cm));
            float c1p     = max(0.0, 1.0 - cm * abs(1.0 - paint));
            float c2p     = max(0.0, 1.0 - cm * abs(paint));
            float c3p     = 1.0 - min(1.0, c1p + c2p);
            float light   = (u_lighting - 0.2) * max(c1p * 5.0 - 4.0, 0.0)
                          + u_lighting * max(c2p * 5.0 - 4.0, 0.0);

            vec4 col1 = vec4(u_c1, 1.0);
            vec4 col2 = vec4(u_c2, 1.0);
            vec4 col3 = vec4(u_c3, 1.0);

            return (0.3 / u_contrast) * col1
                 + (1.0 - 0.3 / u_contrast) * (col1 * c1p + col2 * c2p + col3 * c3p)
                 + light;
        }

        void main() {
            gl_FragColor = effect(u_res, gl_FragCoord.xy);
        }
    `;

    /* ── Setup ── */

    const canvas = document.createElement('canvas');
    canvas.id = 'balatro-bg';
    canvas.style.cssText = [
        'position:fixed',
        'top:0', 'left:0',
        'width:100%', 'height:100%',
        'z-index:-1',
        'pointer-events:none',
        'display:block',
    ].join(';');
    document.body.prepend(canvas);

    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');

    if (!gl) {
        console.warn('[Balatro] WebGL não suportado. Tema sem efeito de fundo.');
        canvas.remove();
        return;
    }

    /* ── Compilar shaders ── */

    function compileShader(type, src) {
        const s = gl.createShader(type);
        gl.shaderSource(s, src);
        gl.compileShader(s);
        if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
            console.error('[Balatro] Shader error:', gl.getShaderInfoLog(s));
        }
        return s;
    }

    const prog = gl.createProgram();
    gl.attachShader(prog, compileShader(gl.VERTEX_SHADER,   VS));
    gl.attachShader(prog, compileShader(gl.FRAGMENT_SHADER, FS));
    gl.linkProgram(prog);
    gl.useProgram(prog);

    /* ── Buffer (quad fullscreen) ── */

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER,
        new Float32Array([-1,-1, 1,-1, -1,1, 1,1]),
        gl.STATIC_DRAW
    );
    const aPos = gl.getAttribLocation(prog, 'a_pos');
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

    /* ── Uniformes ── */

    const U = {
        res:          gl.getUniformLocation(prog, 'u_res'),
        time:         gl.getUniformLocation(prog, 'u_time'),
        c1:           gl.getUniformLocation(prog, 'u_c1'),
        c2:           gl.getUniformLocation(prog, 'u_c2'),
        c3:           gl.getUniformLocation(prog, 'u_c3'),
        contrast:     gl.getUniformLocation(prog, 'u_contrast'),
        lighting:     gl.getUniformLocation(prog, 'u_lighting'),
        spinAmount:   gl.getUniformLocation(prog, 'u_spinAmount'),
        spinRotation: gl.getUniformLocation(prog, 'u_spinRotation'),
        spinSpeed:    gl.getUniformLocation(prog, 'u_spinSpeed'),
        pixelFilter:  gl.getUniformLocation(prog, 'u_pixelFilter'),
    };

    /* ── Resize ── */

    function resize() {
        canvas.width  = window.innerWidth;
        canvas.height = window.innerHeight;
        gl.viewport(0, 0, canvas.width, canvas.height);
    }
    window.addEventListener('resize', resize);
    resize();

    /* ── Loop de render ── */

    const startTime = performance.now();
    let rafId;
    let performanceChecked = false;

    function frame() {
        const t = (performance.now() - startTime) / 1000;

        if (!performanceChecked) {
            performanceChecked = true;
            if (performance.now() - startTime > 50) {
                CFG.pixelFilter = 400;
            }
        }

        gl.uniform2f(U.res, canvas.width, canvas.height);
        gl.uniform1f(U.time, t);
        gl.uniform3fv(U.c1,  CFG.colour1);
        gl.uniform3fv(U.c2,  CFG.colour2);
        gl.uniform3fv(U.c3,  CFG.colour3);
        gl.uniform1f(U.contrast,     CFG.contrast);
        gl.uniform1f(U.lighting,     CFG.lighting);
        gl.uniform1f(U.spinAmount,   CFG.spinAmount);
        gl.uniform1f(U.spinRotation, CFG.spinRotation);
        gl.uniform1f(U.spinSpeed,    CFG.spinSpeed);
        gl.uniform1f(U.pixelFilter,  CFG.pixelFilter);

        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
        rafId = requestAnimationFrame(frame);
    }

    frame();

    /* ── Cleanup (chamado pelo theme-changer ao trocar de tema) ── */

    window.__themeCleanup = function () {
        cancelAnimationFrame(rafId);
        window.removeEventListener('resize', resize);
        gl.getExtension('WEBGL_lose_context')?.loseContext();
        canvas.remove();
    };

})();
