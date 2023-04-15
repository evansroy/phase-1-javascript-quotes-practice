const quoteList = document.querySelector('#quote-list');
const form = document.querySelector('#new-quote-form');

// Function to create a new quote element
function createQuoteCard(quote) {
  const li = document.createElement('li');
  li.className = 'quote-card';
  
  const blockquote = document.createElement('blockquote');
  blockquote.className = 'blockquote';
  
  const p = document.createElement('p');
  p.className = 'mb-0';
  p.textContent = quote.quote;
  
  const footer = document.createElement('footer');
  footer.className = 'blockquote-footer';
  footer.textContent = quote.author;
  
  const br = document.createElement('br');
  
  const likesBtn = document.createElement('button');
  likesBtn.className = 'btn-success';
  likesBtn.innerHTML = `Likes: <span>${quote.likes.length}</span>`;
  
  const deleteBtn = document.createElement('button');
  deleteBtn.className = 'btn-danger';
  deleteBtn.textContent = 'Delete';
  
  blockquote.append(p, footer, br, likesBtn, deleteBtn);
  li.appendChild(blockquote);
  quoteList.appendChild(li);
  
  // Event listener for delete button
  deleteBtn.addEventListener('click', () => {
    fetch(`http://localhost:3000/quotes/${quote.id}`, {
      method: 'DELETE'
    })
    .then(() => {
      li.remove();
    })
    .catch(error => console.log(error));
  });
  
  // Event listener for like button
  likesBtn.addEventListener('click', () => {
    fetch('http://localhost:3000/likes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        quoteId: quote.id
      })
    })
    .then(response => response.json())
    .then(like => {
      quote.likes.push(like);
      likesBtn.innerHTML = `Likes: <span>${quote.likes.length}</span>`;
    })
    .catch(error => console.log(error));
  });
}

// Function to fetch quotes from the API and create elements for each quote
function fetchQuotes() {
  fetch('http://localhost:3000/quotes?_embed=likes')
    .then(response => response.json())
    .then(quotes => {
      quotes.forEach(quote => {
        createQuoteCard(quote);
      });
    })
    .catch(error => console.log(error));
}

// Function to submit a new quote
function submitQuote(event) {
  event.preventDefault();
  const quote = document.querySelector('#new-quote').value;
  const author = document.querySelector('#author').value;
  
  fetch('http://localhost:3000/quotes', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      quote,
      author,
      likes: []
    })
  })
  .then(response => response.json())
  .then(quote => {
    createQuoteCard(quote);
    form.reset();
  })
  .catch(error => console.log(error));
}

// Load quotes on page load
fetchQuotes();

// Event listener for form submission
form.addEventListener('submit', submitQuote);
