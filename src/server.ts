import app from "./app";
import config from './config/config';

app.listen(config.server.port, () => {
    console.info(`Server running on ${config.server.hostname}:${config.server.port}`);
});
