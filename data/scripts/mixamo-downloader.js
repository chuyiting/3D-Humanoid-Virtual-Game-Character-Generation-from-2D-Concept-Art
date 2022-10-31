// Mixamo Animation downloadeer
// The following script make use of mixamo2 API to download all anims for a single character that you choose.
// The animations are saved with descriptive long names instead of the short ones used by default by mixamo UI.
//
//  This script has been written by gnuton@gnuton.org and the author is not responsible of its usage
//
//  How to use this script
//  1. Browse mixamo.com
//  2. Log in
//  3. Open JS console (F12 on chrome)
//  4. Download an animation and get the character ID from the Network tab
//  5. Then past the character id in the "character" variable at beginning of this script
//  6. Copy and paste the full script in the mixamo.com javascript console
//  7. The script will open a new blank page.. you  will start to see animations downloading
//  8. keep the blank page opened and keep on pressing "Allow multiple downlaods" 

// NOTE. This doesn't really work for me, but it was supposed too
// Chrome will ask you all the time to allow multiple downloads
// You can disable this as follow:
// chrome://settings/ > Advanced > Content > Automatic downloads > uncheck "Do not allow any site to download multiple file automatically"

// CHANGE THIS VAR TO DOWNLOAD ANIMATIONS FOR A DIFFERENT CHARACTER
// const character = 'aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee'
// const character = 'ef7eb018-7cf3-4ae1-99ac-bab1c2c5d419'
const character = '037852b5-74da-44aa-878b-eccda13e5139'

/*
Modifications:
1. Use the url below to get the promise with all the character ids.
listUrl = `https://www.mixamo.com/api/v1/products?page=$1&limit=96&order=&type=Character&query=`;

2. Use maxToPage and maxPerPage to specify how many pages of animation and how many animations per page to download
*/



//=================================================================================================

const maxCharNum = 95
const maxToPage = 1
const maxPerPage = 1

const anim_sleep_sec = 1  // seconds slept in between downloading two consecutive animations
const char_sleep_sec = 1   // seconds slept in between downloading animations of two consecutive characters

const bearer = localStorage.access_token

const character_names = ['efb06b46-a470-49b2-b7da-a06755d4dba7', 'cccc84b6-d072-4972-99da-75c5702e25f6', '037852b5-74da-44aa-878b-eccda13e5139', '45d387cb-2276-426b-9547-95f501296b68', 'f7b85d05-5f1c-47d8-9770-9a1a054bd6f6', 'ef7eb018-7cf3-4ae1-99ac-bab1c2c5d419', 'd0496a75-08b9-4f4e-9f1d-f65820323cc2', '6a8a18f1-cb35-4e4b-9b0b-caa20a0101d0', 'c9012369-6099-4f23-b1e8-e45cbdc23d74', 'e89ec3c3-47b4-4d55-87f5-83d91e537136', '91d02eaa-1b0a-4d34-b859-01bcd092c713', '58978fe0-8573-4d51-9666-f6c075f64fd0', '576b18a3-2e3e-4f50-b665-cbca337e0757', '68c2e4b0-1ad6-4e53-b67d-161b8f4ccfbf', 'd13cd86b-a90f-4c8a-81c9-18fc490b40ba', '90815396-6b00-4efc-b670-4c3497dbb605', '3c722a0f-8697-4ef2-93ba-d02155ecaf51', '24c3eeb4-6c47-419d-a593-f7b2948b74c7', '4ebecd82-580e-49f2-8181-b9643ecd9509', '999a29c0-8fb0-42d4-92c8-5b39ca94bd75', '5283eb0c-ed7e-45e2-aec5-da9d0d260285', '39e74902-c602-49c0-9d0b-d35d1ba0c341', '37f11292-3002-46c3-ac53-f773d1a93026', 'aba68976-90b0-4c6d-9f96-922dd1644be5', '7149bc3a-67ad-4f8e-9976-8831a7faf1e4', 'c5ab0438-6309-40a5-bd0c-73ab2e23ecf1', 'e20ce5f8-4392-47bd-8840-6b4675703b49', 'ffaec2ce-dac0-4a60-ae6c-48caf05fd368', '90484e3f-d8be-410f-a3ec-96977f84c2d9', '03d38a1e-ae61-4e43-bfbe-0c92d7d1224b', '814bf7d1-9584-4e16-b519-8575e303eb8c', '3576fd60-beef-49ec-a3d0-f93231f4fc29', '555df3c3-74b7-493b-a790-3b6dbba30fed', '5fb4b535-034a-4011-af3b-2880391547a5', 'eface83a-acc0-4036-a15e-3c650df1510d', '447a4990-f669-436e-a066-e2e2968bdcba', '042954ae-0a57-4d07-a73c-fc685db2ca53', 'a4440477-3191-424b-8703-8126d1982f67', '1b88326e-34c2-4e57-b582-6f8d8017343a', 'baa8eb9f-499f-4a3d-87ee-3f1e41bad413', '75fb0e3e-cf4c-4828-b72b-63b42a4a5cbb', 'f1cc548f-7afc-4ad1-bdde-da70dd40dedf', '9a3bfd6e-732c-4f8d-aeaf-225676b15505', '1b269c4b-c026-45f2-af55-82eb76fe7243', 'cf73b862-b7ca-40e9-a156-1b95393d232e', '62bdaaad-efd3-470b-985b-264c596a57b3', '9da313dd-67a7-4677-8515-7a24b8035a69', '014f0fda-3925-41ed-9dea-b9a14c6d24e0', 'e93ae322-5f54-404c-beb2-86cc1e5b1a79', '41a94250-7c46-4f92-ae48-de7ddadfd8d6', 'd2fa9231-1c9d-45e4-b3a1-41fdb246ddef', '52dcdacb-b43e-4efc-ab6d-9d2d6e09bc95', '4f5d21e1-4ccc-41f1-b35b-fb2547bd8493', '38b86ed5-aaf7-4a88-a791-181d18efcc19', 'a62a2254-74c5-4ce5-8c03-c50c01d07afd', '2312e946-b71e-4b25-b61e-4f51803aa884', '8277608f-32da-42ee-b967-7c052ceb37d4', 'd52abd9a-08dc-4476-b1be-4f2d3dc2c434', '7f3f4e32-2b70-4c69-9a3d-0bdac6188241', '61bcdb20-7b85-4f2e-a109-2a0fbd54af78', 'a58c06c4-3307-40e6-a02d-bfcd658bdbff', 'e90a6228-9937-4a24-83f7-886adcfb0a0a', '733463a7-15f7-4214-bb17-39d802fa7f29', '5867a75c-bfc5-4faa-939f-dcf08efddb58', '862d9e08-a5f4-43d1-a798-f28f5f3ae647', '7ee9295d-a692-4d71-a981-7dd8768cd7fd', 'd075dd28-5474-4be1-972b-26a7bb1af2f4', '5a0e290c-92ea-42e4-afea-cb94ba3fab6d', '3bcbf3bf-63f7-435e-ba9e-f3f137aa639d', '8833e228-8c3e-4a62-863a-9101c3ff053c', '2f8e576f-f69d-453e-830e-969a2f0217ea', 'c0397df3-a96e-4767-826b-f5f67466bf04', '16161dd3-9be1-4d0d-b2cf-4295872988de', '2ab5fc24-52ac-472b-9171-98c05cca7e78', 'b6d6b787-7378-4316-8db9-0434e51a44b4', '6415d7c5-300f-4321-b1e2-33d68912e124', '13c20d1a-c2b7-4725-99da-fe3bbeac2805', '1c7657ea-4644-4d30-aa59-299ece85eae5', '7f7a8824-e060-4e60-8c87-eaaec0f4addf', '56ed684e-aeb5-4e57-ab94-7b475b553a2e', 'bc24ef7d-a89b-4789-bdce-21e0b3e20bba', '9f639098-16d2-423b-b688-146b0c183dd3', '6f2a5541-27eb-4c2a-a3f5-7fd1a54f5081', 'c01a541d-c585-435a-a2b9-5b0524eba790', '23148f55-e80d-4549-9419-1e103b841771', 'e5c581ba-69a5-4b47-aa06-95ee70de3d99', 'c5084efc-f1f6-4721-84f9-4e2cb0c7a4a6', '2b100d25-62a3-4edf-a80b-4e68c4f8234e', 'dc527621-d14a-41f6-aa74-dbdb20dbf017', '130a335c-bbdb-492f-971f-8faab0616b6e', 'ba017cbf-6ca0-43e8-9234-556f0bb18d1b', '456c351c-71fb-420b-9e85-e1aca7273d2d', '129b7c59-46fe-4da4-b434-ee02b204b80e', '3d9daeb8-c2d5-45ce-b835-7cd403c72fc7', 'dfa221bf-4b73-47eb-bb80-fcac2df11458', 'de498e54-f45b-488d-947a-7aee91b9aab0']

const output_char_list = []
const output_anim_list = []

const sleep = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
}


const getAnimationList = (page) => {
    console.log('getAnimationList page=', page);
    const init = {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${bearer}`,
            'X-Api-Key': 'mixamo2'
        }
    };

    const listUrl = `https://www.mixamo.com/api/v1/products?page=${page}&limit=96&order=&type=Motion%2CMotionPack&query=`;
    console.log(listUrl)
    return fetch(listUrl, init).then((res) => res.json()).then((json) => json).catch(() => Promise.reject('Failed to download animation list'))
}

// retrieves json.details.gms_hash 
const getProduct = (animId, character) => {
    console.log('getProduct animId=', animId, ' character=', character);
    const init = {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${bearer}`,
            'X-Api-Key': 'mixamo2'
        }
    };

    const productUrl = `https://www.mixamo.com/api/v1/products/${animId}?similar=0&character_id=${character}`;
    return fetch(productUrl, init).then((res) => res.json()).then((json) => json).catch(() => Promise.reject('Failed to download product details'))
}

const downloadAnimation = (animId, character, product_name) => {
    console.log('downloadAnimation animId=', animId, ' character=', character, ' prod name=', product_name);
    // skip packs
    if (product_name.indexOf(',') > -1) {
        console.log('Skipping pack ', product_name);
        return Promise.resolve('Skip pack!');
    } else {
        return getProduct(animId, character)
                .then((json) => json.details.gms_hash)
                .then((gms_hash) => {
                    const pvals = gms_hash.params.map((param) => param[1]).join(',')
                    const _gms_hash = Object.assign({}, gms_hash, { params: pvals }) // Anim is baked with default param values
                    return exportAnimation(character, [_gms_hash], product_name)
                })
                .then((json) => monitorAnimation(character))
                .catch(() => Promise.reject("Unable to download animation " + animId))
    }
}

const downloadAnimLoop = (o) => {
    console.log('downloadAnimLoop');
    if (!o.anims.length) {
        // return downloadAnimsInPage(o.currentPage + 1, o.totPages, o.character); // no anims left, get a new page
        return downloadAnimsInPage(o.currentPage + 1, maxToPage + 1, o.character);                                          // set hard to page limit
    } 


    const head = o.anims[0];
    // const tail = o.anims.slice(1);
    const tail = o.anims.slice(1, maxPerPage);																			// TODO: remove this

    o.anims = tail;

    return downloadAnimation(head.id, o.character, head.description)
        .then(() => sleep(anim_sleep_sec * 1000))
        .then(() => downloadAnimLoop(o)) //loop
        .catch(() => {
            console.log("Recovering from animation failed to downlaod");
            return downloadAnimLoop(o) // keep on looping 
        })
}

var downloadAnimsInPage = (page, totPages, character) => {
    console.log('downloadAnimsInPage page=', page, ' totPages', totPages, ' character=', character);
    if (page >= totPages) {
        console.log('All pages have been downloaded');
        return Promise.resolve('All pages have been downlaoded');
    }

    return getAnimationList(page)
        .then((json) => (
            {
                anims: json.results,
                currentPage: json.pagination.page,
                totPages: json.pagination.num_pages,
                character
            }))
        .then((o) => downloadAnimLoop(o))																				// TODO: uncomment
        .then((o) => console.log(o['anims']))																			// TODO: comment
        .catch((e) => Promise.reject("Unable to download all animations error ", e))
}

const start = () => {
    console.log('start');
    if (!character) {
        console.error("Please add a valid character ID at the beginnig of the script");
        return
    }
    downloadAnimsInPage(1, maxToPage+1, character);																				// TODO: originally 1 ~ 100 pages
}

// Custom driver function to download for all
const multiStart = () => {
    console.log('start for all characters');
    startSpecificCharacter(character_names.slice(0, maxCharNum));
}

const startSpecificCharacter = (character_names) => {
    if (!character_names.length) {
        console.log('All characters have been downloaded YES!!!');
        return Promise.resolve('All characters have been downlaoded YES!!!');
    }

    const head = character_names[0];
    const tail = character_names.slice(1);

    console.log(tail.length + " left. Now download for " + head);
    return downloadAnimsInPage(1, maxToPage+1, head)
        .then(() => sleep(char_sleep_sec * 1000))
        .then(() => startSpecificCharacter(tail))
        .catch(() => {
            console.log("[E] Recovering from animation failed to downlaod");
            return startSpecificCharacter(tail) // keep on looping 
        })

}



const exportAnimation = (character_id, gmsHashArray, product_name) => {
    console.log('Exporting Anim´:' + character_id + " to file:" + product_name)

    output_char_list.push(character_id)
    output_anim_list.push(product_name)

    const exportUrl = 'https://www.mixamo.com/api/v1/animations/export'

    filename = character_id + "___" + product_name                                                                              // TODO: desired filename
    const exportBody = {
        character_id,
        gms_hash: gmsHashArray, //[{ "model-id": 103120902, "mirror": false, "trim": [0, 100], "overdrive": 0, "params": "0,0,0", "arm-space": 0, "inplace": false }],
        preferences: { format: "fbx7", skin: "true", fps: "30", reducekf: "0" }, // To download collada use format: "dae_mixamo"
        product_name,
        type: "Motion"
    };
    const exportInit = {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${bearer}`,
            'X-Api-Key': 'mixamo2',
            'X-Requested-With': 'XMLHttpRequest'
        },
        body: JSON.stringify(exportBody)
    }


    downloadingTab.location.download = filename

    return fetch(exportUrl, exportInit).then((res) => res.json()).then((json) => json)
}

const monitorAnimation = (characterId) => {
    const monitorUrl = `https://www.mixamo.com/api/v1/characters/${characterId}/monitor`;
    const monitorInit = {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${bearer}`,
            'X-Api-Key': 'mixamo2'
        }
    };
    return fetch(monitorUrl, monitorInit)
        .then((res) => {
            switch (res.status) {
                case 404: {
                    const errorMsg = ('ERROR: Monitor got 404 error: ' + res.error + ' message=' + res.message);
                    console.error(errorMsg);
                    throw new Error(errorMsg);
                } break
                case 202:
                case 200: {
                    return res.json()
                } break
                default:
                    throw new Error('Response not handled', res);
            }
        }).then((msg) => {
            switch (msg.status) {
                case 'completed':
                    console.log('Downloading: ', msg.job_result);
                    downloadingTab.location.href = msg.job_result;
                    return msg.job_result;
                    break;
                case 'processing':
                    console.log('Animation is processing... looping');
                    return monitorAnimation(characterId);
                    break;// loop
                case 'failed':
                default:
                    const errorMsg = ('ERROR: Monitor status:' + msg.status + ' message:' + msg.message + 'result:' + JSON.stringify(msg.job_result));
                    console.error(errorMsg);
                    throw new Error(errorMsg);
            }
        }).catch((e) => Promise.reject("Unable to monitor job for character " + characterId + e))
}

// Workaround for downloading files from a promise
// NOTE that chrome will detect you are downloading multiple files in a single TAB. Please allow it!
const downloadingTab = window.open('', '_blank');

multiStart();
