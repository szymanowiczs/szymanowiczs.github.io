function waitForVideoPlayable(videoElement) {
    return new Promise((resolve) => {
        if (videoElement.readyState >= 2) {
            resolve();
        } else {
            videoElement.addEventListener('loadeddata', () => resolve(), { once: true });
        }
    });
}


export async function setupGallery() {
    const shuffleArray = array => {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            const temp = array[i];
            array[i] = array[j];
            array[j] = temp;
        }
    }

    const premiumVideoPaths = [
        "bike_src.webm",
        "bonefire_i2v.webm",
        "26_input_src_loop_loop.webm",
        "car_src_loop_loop.webm",
        "IMG_3750_src_loop_loop.webm",
        "panda_popcorn_i2v_src_loop_loop.webm",
        "teddybear_snow_i2v_src_loop_loop.webm",
        "05d3319c-c749-4340-a0bf-871d1db7698b_src_spiral_spiral.webm",
        "E8F2615C-944F-4F80-85D9-5B5AB6D7CC30_src_spiral_spiral.webm",
        "4d80ee39-e1b3-4fdf-aea3-52253f60b0e2_src_spiral_spiral.webm",
        "A_dark_alleyway_in_a_rainstorm_src_spiral_spiral.webm",
        "The_Girl_with_a_Pearl_Earring__by_Johannes_Vermeer_src_spiral_spiral.webm",
        "robot_i2v_src_spiral_spiral.webm",
        "wave_i2v_src_spiral_spiral.webm",
    ]

    // Update this with gen_file_list.py.
    const videoPaths = [
        "img_0_10_src.webm",
        "18c9c394-da40-43f2-84d6-c444890df88b_src_spiral_spiral.webm",
        "bedroom3_src.webm",
        "panda_car_i2v_src_loop_loop.webm",
        "IMG_20160322_200534_src_spiral_spiral.webm",
        "IMG_2729_src_spiral_spiral.webm",
        "A_minimap_diorama_of_a_cafe_adorned_with_indoor_plants_src_spiral_spiral.webm",
        "sloth_i2v_src_loop_loop.webm",
        "IMG_7841_src_spiral_spiral.webm",
        "IMG_1295_src_spiral_spiral.webm",
        "skeleton_i2v_src_loop_loop.webm",
        "panda_bamboo_i2v_src_loop_loop.webm",
        "IMG_0752_src_spiral_spiral.webm",
        "PXL_20240421_134255779_src_spiral_spiral.webm",
        "A_cute_corgi_lives_in_a_house_made_out_of_sushi_src_loop_loop.webm",
        "IMG_5279_src_spiral_spiral.webm",
        "5ADD4FB0-DC1D-4C75-A7AA-ED046B333009_src_loop_loop.webm",
        "IMG_7262_src_spiral_spiral.webm",
        "A_Maine_Coon_sprawls_across_a_leather_sofa,_its_tail_hanging_over_the_edge,_a_nature_documentary_playing_softly_on_the_television_src_spiral_spiral.webm",
        "IMG_7838_src_loop_loop.webm",
        "A_photo_of_a_confused_racoon_in_computer_programming_class_src_spiral_spiral.webm",
        "A_3D_printed_cat-robot_hybrid_sits_slumped_amidst_a_chaotic_mess_of_papers_covered_in_complex_equations_and_diagrams,_its_metallic_paws_loosely_curled_and_LED_eyes_dimmed_src_loop_loop.webm",
        "IMG_0799_src_spiral_spiral.webm",
        "IMG_7892_src_spiral_spiral.webm",
        "teddybear_nyc_i2v_src_spiral_spiral.webm",
        "IMG_0843_src_spiral_spiral.webm",
        "monkey_coffee_i2v_src_loop_loop.webm",
        "IMG_7979_src_spiral_spiral.webm",
        "A_crab_made_of_cheese_on_a_plate_src_spiral_spiral.webm",
        "IMG_5928_src_spiral_spiral.webm",
        "20_input_src_loop_loop.webm",
        "A_Persian_cat_naps_in_a_sunbeam_streaming_through_a_window,_its_fur_shimmering,_a_half-finished_crossword_puzzle_lying_on_the_table_src_spiral_spiral.webm",
        "A_Maine_Coon_sprawls_across_a_cluttered_desk_src_spiral_spiral.webm",
        "bee_i2v_src_loop_loop.webm",
        "IMG_9160_src_loop_loop.webm",
        "A_Persian_cat_nestles_in_a_basket_of_laundry,_its_fur_ruffled_as_a_forgotten_podcast_plays_softly_src_loop_loop.webm",
        "IMG_2991_src_spiral_spiral.webm",
        "7c3707e2d3425b9c.webm",
        "8b5b10275b8a2d7e.webm",
        "91a772967d0c828b.webm",
        "8725e58028e2f1fe.webm",
        "836441bc56499fd6.webm",
        "809859830a3e0e55.webm",
        "849115291c948385.webm",
    ];

    shuffleArray(premiumVideoPaths);
    shuffleArray(videoPaths);

    var thumbnails = document.getElementById("thumbnails");
    var isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;


    var i = 0;
    const videos = []

    for (let videoPath of [...premiumVideoPaths, ...videoPaths]) {
        // Create column element for each video
        var column = document.createElement("DIV");
        column.className = "col-lg-3 col-md-4 col-sm-6 mb-4";

        var outer = document.createElement("DIV");
        outer.className = "thumbnail outer card h-100";
        outer.style.position = "relative";

        var inner = document.createElement("DIV");
        inner.style.padding = "5px";
        inner.className = "inner card-body";

        // Create thumbnail image
        var thumbnailImg = document.createElement("IMG");

        // Generate thumbnail path from video path
        let thumbnailPath = videoPath.replace(".webm", ".png");
        // Remove the special suffixes
        thumbnailPath = thumbnailPath
            .replace("_src_loop_loop", "_input")
            .replace("_src_loop_spiral", "_input")
            .replace("_src_spiral_loop", "_input")
            .replace("_src_spiral_spiral", "_input")
            .replace("_src", "_input");

        const img_path = `bolt3d/gallery_videos_compressed/${thumbnailPath}`;
        thumbnailImg.src = img_path;
        thumbnailImg.className = "thumbnail-overlay";
        thumbnailImg.style.position = "absolute";
        thumbnailImg.style.top = "5px";
        thumbnailImg.style.left = "5px";
        thumbnailImg.style.width = "70px";
        thumbnailImg.style.height = "70px";
        thumbnailImg.style.zIndex = "10";
        thumbnailImg.style.borderRadius = "3px";
        thumbnailImg.style.border = "1px solid white";
        thumbnailImg.style.transition = "transform 0.2s ease";

        thumbnailImg.onmouseover = function () {
            this.style.transform = "scale(1.6)";
        };

        thumbnailImg.onmouseout = function () {
            this.style.transform = "scale(1)";
        };

        var componentVideo = document.createElement("VIDEO");
        componentVideo.style.width = "100%"
        componentVideo.style.height = "100%"
        componentVideo.autoplay = true;
        componentVideo.muted = true;
        componentVideo.loop = true;
        componentVideo.playsinline = true;
        componentVideo.controls = false;
        componentVideo.className = "video";
        componentVideo.src = `bolt3d/gallery_videos_compressed/${videoPath}`;
        componentVideo.preload = "auto"


        if (!isIOS) {
            componentVideo.onmousemove = componentVideo.play;
            componentVideo.onmouseout = componentVideo.play;
            componentVideo.onkeyup = componentVideo.play;
            componentVideo.onmouseover = componentVideo.play;
        }

        inner.appendChild(componentVideo);
        outer.appendChild(inner);
        outer.appendChild(thumbnailImg); // Add thumbnail to the card
        column.appendChild(outer);
        thumbnails.appendChild(column);

        videos.push(componentVideo)
    }

    for (const video of videos) {
        await waitForVideoPlayable(componentVideo)
    }
}