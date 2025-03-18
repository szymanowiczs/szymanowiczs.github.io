export async function setupCompare() {
    const playbackSpeeds = {
        "flash3d": [1.5, 1.5],
        "cat3d_1": [0.8, 1.0],
        "realmdreamer": [1.0, 1.0],
        "cat3d_3": [1.0, 1.0],
    };
    const labels = {
        "flash3d": "Flash3D",
        "cat3d_1": "CAT3D (x64 more expensive)",
        "realmdreamer": "RealmDreamer (x600 more expensive)",
        "cat3d_3": "CAT3D (x300 more expensive)",
    }

    var compareDiv = document.querySelector("#baseline-compare")
    var activeMethod = "flash3d"
    var activeScene = "00ca5123d8ff6f83"

    // Select all elements with the class 'method-pill'
    const methodPills = compareDiv.querySelectorAll('.method-pill');

    const videoParent = compareDiv.querySelector(".video-container");
    const leftVideo = videoParent.querySelector('#single-comp-left')
    const rightVideo = videoParent.querySelector('#single-comp-right')
    const scenePillContainers = compareDiv.querySelectorAll(`.scene-pills`);

    const leftLabel = videoParent.querySelector("#single-comp-label-left")

    for (var methodPill of methodPills) {
        const method = methodPill.getAttribute('data-value');
        // Select all scene pill containers
        const scenePillContainer = compareDiv.querySelector(`#${method}-pills`);
        const scenePills = scenePillContainer.querySelectorAll(".scene-pill")

        for (var scenePill of scenePills) {
            scenePill.addEventListener('click', function () {
                activeScene = this.getAttribute("data-value")
                updateDisplay();
            });
        }

        // Attach a click event listener to each pill
        methodPill.addEventListener('click', function () {
            activeMethod = method
            const scenePillContainer = compareDiv.querySelector(`#${method}-pills`);
            const scenePills = scenePillContainer.querySelectorAll(".scene-pill")
            activeScene = scenePills[0].getAttribute("data-value")
            updateDisplay();
        });
    }

    function updateDisplay() {
        methodPills.forEach(p => p.classList.remove('active'));
        methodPills.forEach(methodPill => {
            if (methodPill.getAttribute('data-value') == activeMethod) {
                methodPill.querySelector('a').classList.add('active');
            } else {
                methodPill.querySelector('a').classList.remove('active')
            }
        });

        // Show/Hide scene pill containers based on the selected method
        scenePillContainers.forEach(container => {
            if (container.id === `${activeMethod}-pills`) {
                container.style.display = ''; // Or 'block' depending on your layout
            } else {
                container.style.display = 'none';
            }
        });

        const scenePillContainer = compareDiv.querySelector(`#${activeMethod}-pills`);
        const scenePills = scenePillContainer.querySelectorAll(".scene-pill")

        for (scenePill of scenePills) {
            if (scenePill.getAttribute('data-value') == activeScene) {
                scenePill.classList.add('active');
            } else {
                scenePill.classList.remove('active')
            }
        }

        // Update video display. This still has a small flash, could double buffer the video like before, but
        // as long as the layout stays consistent it really isn't bad.
        leftVideo.src = `bolt3d/comparison/${activeMethod}/baseline/${activeScene}.mp4`

        // HACK: Realmdreamer and cat3d_1 have the same 'ours', so just share those files.
        if (activeMethod == "realmdreamer") {
            rightVideo.src = `bolt3d/comparison/cat3d_1/ours/${activeScene}.mp4`
        }
        else {
            rightVideo.src = `bolt3d/comparison/${activeMethod}/ours/${activeScene}.mp4`
        }

        var [lr, rr] = playbackSpeeds[activeMethod];
        leftVideo.playbackRate = lr;
        rightVideo.playbackRate = rr;
        // Manually update aspect ratio so layout doesn't have a weird flash.
        videoParent.style.aspectRatio = 2.25;
        leftLabel.innerHTML = labels[activeMethod];
    }

    // Update initial display
    updateDisplay()
}
