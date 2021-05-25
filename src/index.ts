import server from './server';
import settings from './config/settings';

server.listen(settings.port, async () => {
    console.log(`Listening on port ${settings.port}`);
});
