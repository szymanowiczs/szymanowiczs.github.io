function waitForVideoFullyLoaded(videoElement) {
    return new Promise((resolve) => {
        if (videoElement.readyState === 4) {
            resolve();
        } else {
            const checkLoaded = () => {
                if (videoElement.readyState === 4) {
                    videoElement.removeEventListener('canplaythrough', checkLoaded);
                    resolve();
                }
            };
            videoElement.addEventListener('canplaythrough', checkLoaded);
        }
    });
}

export async function setupBrush() {
    const fallbackVideo = document.getElementById('viewer-fallback-video');

    if (!('gpu' in navigator)) {
        const warningElement = document.getElementById('warning-msg');
        const contentElement = document.getElementById('viewer-content');

        warningElement.style.display = 'block';

        const child = document.createElement('p');
        child.classList = "warning-message";
        child.innerHTML =
            'Your browser does not appear to support the WebGPU API. Currently, only Chrome is supported currently. For linux, please enable WebGPU.';
        warningElement.appendChild(child);
        contentElement.style.display = 'none';

        fallbackVideo.src = `bolt3d/models/car_interactive.webm`
    }
    // Load the viewer if things are all good.
    else {
        fallbackVideo.style.display = 'none'

        const brush_js = await import('../brush-demo/brush-app-b691f0d9be45f400.js');
        const init = brush_js.default;
        const bindings = { ...brush_js };

        const originalFocus = HTMLElement.prototype.focus;
        HTMLElement.prototype.focus = function () {
            if (!this.matches('[id="brush_canvas"]')) {
                originalFocus.apply(this, arguments);
            }
        };

        await init({ module_or_path: 'bolt3d/brush-demo/brush-app-b691f0d9be45f400_bg.wasm' });
        window.wasmBindings = bindings;

        const baseUrl = "https://storage.googleapis.com/realtime-nerf-360/glgm"
        // const startUrl = `${baseUrl}/img_1_140.compressed.ply`

        var start_cmd = `?zen=true&focal=0.9`
        const viewer = new window.wasmBindings.EmbeddedApp("brush_canvas", start_cmd)
        window.viewer = viewer;

        function setCamSettings(yaw_range) {
            viewer.set_camera_settings(new window.wasmBindings.CameraSettings(
                    /* focal: f64*/ 1.0,
                    /* start_distance: f32*/ 0.525,
                    /* focus_distance: f32*/ 0.9,
                    /* speed_scale: f32*/ 0.075,
                    /* min_focus_distance: Option<f32>*/ 0.4,
                    /* max_focus_distance: Option<f32>*/ 1.2,
                    /* min_pitch: Option<f32>*/ -50.0,
                    /* max_pitch: Option<f32>*/ 5.0,
                    /* min_yaw: Option<f32>*/ yaw_range ? -yaw_range : null,
                    /* max_yaw: Option<f32>*/ yaw_range ? yaw_range : null,
            ))
        }

        const load_model = async function (name) {
            console.log(`Loading model ${name}`)

            const yaw_ranges = {
                "18c9c394-da40-43f2-84d6-c444890df88b": 30.0,
                "img_0_10": 30.0,
                "bike": 45.0,
            }

            viewer.load_url(`${baseUrl}/${name}.compressed.ply`)

            // Set yaw range if needed.
            setCamSettings(yaw_ranges[name] ?? null)
        }

        const modelNames = [
            "img_1_140",
            "kitchen",
            "frog",
            "forest",
            "18c9c394-da40-43f2-84d6-c444890df88b",
            "lighthouse",
            "bedroom3",
            "A_cute_corgi_lives_in_a_house_made_out_of_sushi",
            "teddybear_skate_i2v",
            "bike",
            "living_room",
            "resolute",
            "IMG_7841",
            "img_0_10",
        ];

        // Get the container element
        const container = document.getElementById('viewer-pills');

        const videos = []
        // Generate a pill for each model name
        for (const modelName of modelNames) {
            // Create the pill container element
            const pill = document.createElement('div');
            pill.className = 'pill scene-pill-large';

            const video = document.createElement('video');
            video.className = 'card-img';
            video.src = `bolt3d/models/${modelName}.mp4`;
            video.addEventListener('mouseover', function () {
                this.play();
            });
            video.addEventListener('mouseout', function () {
                this.pause();
                this.currentTime = 0;
            });
            video.addEventListener('click', function () { load_model(modelName) });
            video.preload = "auto"

            // Assemble the elements
            pill.appendChild(video);

            // Add the complete pill to the container
            container.appendChild(pill);

            videos.push(video)
        }

        // Wait for videos to be playable.
        for (const video of videos) {
            await waitForVideoFullyLoaded(video)
        }

        // await new Promise(resolve => setTimeout(resolve, 500));
        load_model("img_1_140")
    }
}