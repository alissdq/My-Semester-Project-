
import { useEffect, useState } from 'react'
import './App.css'

const initialItems = [
  { id: 1, name: 'Carrots', category: 'Vegetables', quantity: 3, useBy: '2026-11-10' },
  { id: 2, name: 'Apples', category: 'Fruits', quantity: 5, useBy: '2026-11-12' },
]

function Header() {
  return (
    <header>
      <h2>🥬 FreshSave</h2>
      <nav>
        <a href="#home">Home</a>
        <a href="#tracker">Tracker</a>
        <a href="#about">About</a>
      </nav>
    </header>
  )
}

function ItemCard({ item, onDelete }) {
  return (
    <article className="card">
      <h3>{item.name}</h3>
      <p>Category: {item.category}</p>
      <p>Quantity: {item.quantity}</p>
      <p>Use by: {item.useBy}</p>
      <button onClick={() => onDelete(item.id)}>Delete</button>
    </article>
  )
}

function FoodForm({ onAdd }) {
  const [name, setName] = useState('')
  const [category, setCategory] = useState('Vegetables')
  const [quantity, setQuantity] = useState(1)
  const [useBy, setUseBy] = useState('')

  function handleSubmit(event) {
    event.preventDefault()
    if (!name.trim() || !useBy || quantity < 1) {
      alert('Please fill in all fields correctly.')
      return
    }
    onAdd({
      id: Date.now(),
      name: name.trim(),
      category,
      quantity: Number(quantity),
      useBy,
    })
    setName('')
    setQuantity(1)
    setUseBy('')
  }

  return (
    <form onSubmit={handleSubmit} className="panel">
      <h2>Add food</h2>
      <label>Ingredient name</label>
      <input value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Carrots" />
      <label>Category</label>
      <select value={category} onChange={e => setCategory(e.target.value)}>
        <option>Vegetables</option>
        <option>Fruits</option>
        <option>Dairy</option>
        <option>Grains</option>
        <option>Other</option>
      </select>
      <label>Quantity</label>
      <input type="number" min="1" max="999" value={quantity} onChange={e => setQuantity(e.target.value)} />
      <label>Plan to use by</label>
      <input type="date" value={useBy} onChange={e => setUseBy(e.target.value)} />
      <button type="submit">Add ingredient</button>
    </form>
  )
}

function FoodList({ items, onDelete }) {
  return (
    <section>
      <h2>My food list ({items.length})</h2>
      <div className="cards">
        {items.map(item => (
          <ItemCard key={item.id} item={item} onDelete={onDelete} />
        ))}
      </div>
      {items.length === 0 && <p>No ingredients yet. Add one above.</p>}
    </section>
  )
}

function App() {
const [items, setItems] = useState(() => {
  const saved = localStorage.getItem('freshsave-items-v1')
  return saved ? JSON.parse(saved) : initialItems
})

useEffect(() => {
  localStorage.setItem('freshsave-items-v1', JSON.stringify(items))
}, [items])
  const [search, setSearch] = useState('')

  function addItem(item) {
    setItems(previous => [...previous, item])
  }

  function deleteItem(id) {
    setItems(previous => previous.filter(item => item.id !== id))
  }

  const filteredItems = items.filter(item =>
    item.name.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <>
      <Header />
      <main id="home">
        <h1>FreshSave — Food Waste Tracker</h1>
        <p>Save food, reduce waste, and manage your ingredients!</p>
        <FoodForm onAdd={addItem} />
        <section id="tracker">
          <h2>Search ingredients</h2>
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search food..."
          />
          <FoodList items={filteredItems} onDelete={deleteItem} />
        </section>
        <section id="about">
          <h2>About FreshSave</h2>
          <p>FreshSave helps people manage food at home and reduce food waste.</p>
        </section>
      </main>
      <footer>FreshSave - Student Semester Project</footer>
    </>
  )
}

export default App