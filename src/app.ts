import express from 'express';
import cors from 'cors';
import router from './router';
import bodyParser from 'body-parser';

const app = express();
app.use(cors({
  origin: 'http://localhost:5173'
}));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json())

app.use((req, _, next) => {
    console.log(`${req.method} ${req.path}`);
    next();
});

app.use(router);

app.listen(3333, () => {
  console.log('Server started on port 3333');
})