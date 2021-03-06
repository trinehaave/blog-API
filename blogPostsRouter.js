const express = require('express')
const router = express.Router()
const morgan = require('morgan')
const bodyParser = require('body-parser')

const {BlogPosts} = require('./models')

const jsonParser = bodyParser.json()


router.use(morgan('common'))

BlogPosts.create(
	'Tittel',
	'Innhold. Blablabla.',
	'Trine'
	)

BlogPosts.create(
	'Hello world', 
	'Lorem ipsum dolor sit amet, consectetur adipisicing elit. A', 
	'Trine')

router.get('/', (req, res) => {
	res.json(BlogPosts.get())
})


router.post('/', jsonParser, function(req, res) {
	const requiredFields = ['title', 'content', 'author'];
  for (let i=0; i<requiredFields.length; i++) {
    const field = requiredFields[i]
    if (!(field in req.body)) {
      const message = `Missing \`${field}\` in request body`
      console.error(message)
      return res.status(400).send(message)
		}
	}
  const item = BlogPosts.create(req.body.title, req.body.content, req.body.author);
  res.status(201).json(item);
})

router.put('/:id', jsonParser, (req, res) => {
  const requiredFields = ['title', 'content', 'author', 'id', 'publishDate'];
  for (let i=0; i<requiredFields.length; i++) {
    const field = requiredFields[i];
    if (!(field in req.body)) {
      const message = `Missing \`${field}\` in request body`
      console.error(message);
      return res.status(400).send(message);
    }
  }
  if (req.params.id !== req.body.id) {
    const message = (
      `Request path id (${req.params.id}) and request body id `
      `(${req.body.id}) must match`);
    console.error(message);
    return res.status(400).send(message);
  }
  console.log(`Updating blogpost \`${req.params.id}\``);
  const updatedItem = BlogPosts.update({
    id: req.params.id,
    title: req.body.title,
    content: req.body.content,
    author: req.body.author
  });
  res.status(204).json(updatedItem);
});

router.delete('/:id', (req, res) => {
  BlogPosts.delete(req.params.id);
  console.log(`Deleted blog post \`${req.params.ID}\``);
  res.status(204).end();
});

module.exports = router;