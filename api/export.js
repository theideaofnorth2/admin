const fs = require('fs');
const path = require('path');
const request = require('request');
const keystone = require('keystone');
const DirectusRemoteInstance = require('directus-sdk-javascript/remote');

/*
  Export tool
  Sorry Keystonejs, you had me wait toooooo looooong for a release
  Aint got love for you anymore :( leaving you for PHP!
*/

const directusApiUri = process.env.DIRECTUS_API_URI;
const localImagesPath = path.join(__dirname, '../../assets/images_old');
const localSoundsPath = path.join(__dirname, '../../assets/sounds');

exports.apiExport = async (req, res, next) => {
  const Origin = keystone.list('Origin');
  const Destination = keystone.list('Destination');
  const Egg = keystone.list('Egg');
  const Interview = keystone.list('Interview');
  const Guide = keystone.list('Guide');
  const Page = keystone.list('Page');

  /*
    Create files
  */

  const createImage = (directusClient, { localDir, localName, title, tags }) =>
    new Promise((resolve, reject) => {
      if (localName === '') resolve();
      const imageAsBase64 = fs.readFileSync(
        `${localImagesPath}/${localDir}/${localName}`,
        'base64',
      );
      directusClient
        .createFile({
          type: 'image/jpeg',
          name: localName,
          title: title,
          tags: tags,
          data: `data:image/jpeg;base64,${imageAsBase64}`,
        })
        .then(response => {
          resolve(response.data.id);
        });
    });

  const createSvg = (directusClient, { localDir, localName, title, tags }) =>
    new Promise((resolve, reject) => {
      if (localName === '') resolve();
      const imageAsBase64 = fs.readFileSync(
        `${localImagesPath}/${localDir}/${localName}`,
        'base64',
      );
      directusClient
        .createFile({
          type: 'image/svg+xml',
          name: localName,
          title: title,
          tags: tags,
          data: `data:image/svg+xml;base64,${imageAsBase64}`,
        })
        .then(response => {
          resolve(response.data.id);
        });
    });

  const createSound = (directusClient, { localName, title, tags }) =>
    new Promise((resolve, reject) => {
      if (localName === '') resolve();
      const imageAsBase64 = fs.readFileSync(
        `${localSoundsPath}/${localName}`,
        'base64',
      );
      directusClient
        .createFile({
          type: 'audio/x-m4a',
          name: localName,
          title: title,
          tags: tags,
          data: `data:audio/x-m4a;base64,${imageAsBase64}`,
        })
        .then(response => {
          const mp3Name = localName.replace('m4a', 'mp3');
          if (!fs.existsSync(`${localSoundsPath}/${mp3Name}`)) {
            return resolve(response.data.id);
          }
          const mp3AsBase64 = fs.readFileSync(
            `${localSoundsPath}/${mp3Name}`,
            'base64',
          );
          if (!mp3AsBase64) {
            return resolve(response.data.id);
          }
          directusClient
            .createFile({
              type: 'audio/x-mp3',
              name: mp3Name,
              title: mp3Name,
              tags: tags,
              data: `data:audio/x-mp3;base64,${mp3AsBase64}`,
            })
            .then(() => {
              resolve(response.data.id);
            });
        });
    });

  /*
    Mappings
  */

  const saveMappings = (name, results) => {
    const mappings = {};
    results.forEach(({ original, created }) => {
      mappings[original.id] = created.id;
    });

    fs.writeFileSync(
      `./api/mappings/${name}.json`,
      JSON.stringify({ [name]: mappings }),
      'utf8',
    );
  };

  const saveMappingsInterviews = (name, results, mappings) => {
    results.forEach(({ original, created }) => {
      if (original.customId) {
        mappings[original.customId] = created.id;
      }
    });

    fs.writeFileSync(
      `./api/mappings/${name}.json`,
      JSON.stringify({ [name]: mappings }),
      'utf8',
    );
  };

  const exportCities = async itemConfig => {
    const items = await itemConfig.collection.model.getAll();
    const results = await Promise.all(
      items.map(async item => {
        const createdImage = await createImage(directusClient, {
          localDir: itemConfig.localDir,
          localName: item.image,
          title: item.image,
          tags: itemConfig.tags,
        });
        const createdItem = await itemConfig.cb(
          directusClient,
          item,
          createdImage,
        );
        return { original: item, created: createdItem.data };
      }),
    );

    saveMappings(itemConfig.name, results);
    return results;
  };

  /*
    Origins
  */

  const createOrigin = (directusClient, origin, imageId) =>
    new Promise((resolve, reject) => {
      directusClient
        .createItem('origins', {
          status: 1,
          name: origin.name,
          native_name: origin.nativeName,
          location: `${origin.lat},${origin.lng}`,
          image: imageId,
          vertical: origin.vertical,
          horizontal: origin.horizontal,
          zoom: origin.zoom,
        })
        .then(response => {
          resolve(response);
        });
    });

  const originConfig = {
    name: 'origins',
    collection: Origin,
    cb: createOrigin,
    tags: 'city',
  };

  const exportOrigins = async () => exportCities(originConfig);

  /*
    Destinations
  */

  const createDestination = (directusClient, destination, imageId) =>
    new Promise((resolve, reject) => {
      directusClient
        .createItem('destinations', {
          status: 1,
          name: destination.name,
          native_name: destination.nativeName,
          location: `${destination.lat},${destination.lng}`,
          image: imageId,
          vertical: destination.vertical,
          horizontal: destination.horizontal,
        })
        .then(response => {
          resolve(response);
        });
    });

  const destinationConfig = {
    name: 'destinations',
    localDir: 'cities',
    collection: Destination,
    cb: createDestination,
    tags: 'city',
  };

  const exportDestinations = async () => exportCities(destinationConfig);

  /*
    Eggs
  */

  const createEgg = (directusClient, egg, imageId, originMappings) =>
    new Promise((resolve, reject) => {
      directusClient
        .createItem('eggs', {
          status: 1,
          name: egg.name,
          origin_id: originMappings[egg.originId],
          video: egg.video,
          location: `${egg.lat},${egg.lng}`,
          image: imageId,
          vertical: egg.vertical,
          horizontal: egg.horizontal,
        })
        .then(response => {
          resolve(response);
        });
    });

  const eggConfig = {
    name: 'eggs',
    localDir: 'eggs',
    collection: Egg,
    cb: createEgg,
    tags: 'egg',
  };

  const exportEggs = async () => {
    const itemConfig = eggConfig;
    const items = await itemConfig.collection.model.getAll();
    const results = await Promise.all(
      items.map(async item => {
        const createdImage = await createSvg(directusClient, {
          localDir: itemConfig.localDir,
          localName: item.image,
          title: item.image,
          tags: itemConfig.tags,
        });
        const createdItem = await itemConfig.cb(
          directusClient,
          item,
          createdImage,
        );
        return { original: item, created: createdItem.data };
      }),
    );

    saveMappings(itemConfig.name, results);
    return results;
  };

  /*
    Interviews
  */

  const createInterview = (
    directusClient,
    interview,
    soundId,
    originMappings,
    destinationMappings,
    eggMappings,
  ) =>
    new Promise((resolve, reject) => {
      directusClient
        .createItem('interviews', {
          status: 1,
          name: interview.name,
          custom: interview.customId,
          sound: soundId,
          origin_id: originMappings[interview.originId],
          destination_id: destinationMappings[interview.destinationId],
          parent: interview.parent,
          egg_id: eggMappings[interview.eggId],
          top: interview.top,
          left: interview.left,
          location: `${interview.lat},${interview.lng}`,
        })
        .then(response => {
          resolve(response);
        });
    });

  const interviewConfig = {
    name: 'interviews',
    localDir: 'interviews',
    collection: Interview,
    cb: createInterview,
    tags: 'interview',
  };

  const exportInterviews = async () => {
    const originMappings = require('./mappings/origins.json').origins;
    const destinationMappings = require('./mappings/destinations.json')
      .destinations;
    const eggMappings = require('./mappings/eggs.json').eggs;
    const interviewMappings = require('./mappings/interviews.json').interviews;

    const itemConfig = interviewConfig;

    const items = await itemConfig.collection.model.getAll();
    const results = await Promise.all(
      [items[35], items[36]].map(async item => {
        const createdImage = await createSound(directusClient, {
          localDir: itemConfig.localDir,
          localName: item.sound,
          title: item.sound,
          tags: itemConfig.tags,
        });
        const createdItem = await itemConfig.cb(
          directusClient,
          item,
          createdImage,
          originMappings,
          destinationMappings,
          eggMappings,
        );
        return { original: item, created: createdItem.data };
      }),
    );

    saveMappingsInterviews(itemConfig.name, results, interviewMappings);
    return results;
  };

  /*
    Slides
  */

  const createSlide = (directusClient, { time, imageId, interviewId }) =>
    new Promise((resolve, reject) => {
      directusClient
        .createItem('slides', {
          status: 1,
          image: imageId,
          interview_id: interviewId,
          time,
        })
        .then(response => {
          resolve(response);
        });
    });

  const slideConfig = {
    name: 'interviews',
    localDir: 'interviews',
    cb: createSlide,
    tags: 'slide',
  };
  const exportSlides = async () => {
    const slideshows = require('./slideshow.json');
    const interviewMappings = require('./mappings/interviews.json').interviews;
    const customIds = Object.keys(interviewMappings);
    const slideshowKey = customIds[30];
    const slideData = {
      slideshowKey: slideshowKey,
      slides: slideshows[slideshowKey],
      interviewId: interviewMappings[slideshowKey],
    };

    const itemConfig = slideConfig;
    console.log(slideshowKey);
    if (!slideData.slides) return;

    const results = await Promise.all(
      slideData.slides.map(async item => {
        const createdImage = await createImage(directusClient, {
          localDir: `${itemConfig.localDir}/${slideData.slideshowKey}`,
          localName: item.name,
          title: item.name,
          tags: itemConfig.tags,
        });
        const createdItem = await itemConfig.cb(directusClient, {
          time: item.startTime,
          imageId: createdImage,
          interviewId: slideData.interviewId,
        });
        return { original: item, created: createdItem.data };
      }),
    );
    return results;
  };

  /*
    Authentication
    WTF Directus I should be able to do this with the JS SDK
  */

  const getDirectusToken = () =>
    new Promise((resolve, reject) => {
      const authRequestPayload = {
        headers: { 'content-type': 'application/x-www-form-urlencoded' },
        url: `${directusApiUri}auth/request-token`,
        form: {
          email: process.env.DIRECTUS_EMAIL,
          password: process.env.DIRECTUS_PASSWORD,
        },
      };
      request.post(authRequestPayload, (error, response, body) => {
        resolve(JSON.parse(body).data.token);
      });
    });

  const token = await getDirectusToken();
  const directusClient = new DirectusRemoteInstance({
    url: directusApiUri,
    accessToken: [token],
  });

  /*
    Actual call
  */

  /*
  const results = await exportSlides();

  res.apiResponse({ results });
  */
};
