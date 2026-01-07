import { useMemo, useState } from "react";
import "./App.css";

// IMPORTANT: files must exist in src/assets/
import deleteIcon from "./assets/delete.svg";
import inkPenIcon from "./assets/ink_pen.svg";
import flatwareIcon from "./assets/flatware.svg";
import electricalIcon from "./assets/electrical_services.svg";

const CATEGORIES = ["Stationary", "Kitchenware", "Appliance"];

function normalizeName(s) {
  return s.trim().toLowerCase();
}

function categoryIcon(category) {
  switch (category) {
    case "Stationary":
      return inkPenIcon;
    case "Kitchenware":
      return flatwareIcon;
    case "Appliance":
      return electricalIcon;
    default:
      return null;
  }
}

export default function App() {
  // keep initial sample items (เหมือนตัวอย่างในภาพ)
  const [items, setItems] = useState([
    { id: 1, name: "Color Pencil set 32", category: "Stationary", price: 11.99 },
    { id: 2, name: "Small Kitty Lamp", category: "Appliance", price: 44.88 },
    { id: 3, name: "Knife Set 4pcs", category: "Kitchenware", price: 23.11 },
  ]);

  // auto incremental ID
  const nextId = useMemo(() => {
    const maxId = items.reduce((m, it) => Math.max(m, it.id), 0);
    return maxId + 1;
  }, [items]);

  // form state (no default category)
  const [name, setName] = useState("");
  const [category, setCategory] = useState(""); // must choose
  const [price, setPrice] = useState("0");
  const [error, setError] = useState("");

  function validate() {
    const trimmed = name.trim();

    if (!trimmed) return "Item name must not be empty";

    const duplicated = items.some(
      (it) => normalizeName(it.name) === normalizeName(trimmed)
    );
    if (duplicated) return "Item must not be duplicated";

    if (!CATEGORIES.includes(category)) return "Please select a category";

    const p = Number(price);
    if (Number.isNaN(p) || p < 0) return "Price must not be less than 0";

    return "";
  }

  function onAdd() {
    const msg = validate();
    if (msg) {
      setError(msg);
      return;
    }

    const newItem = {
      id: nextId,
      name: name.trim(),
      category,
      price: Number(price),
    };

    setItems((prev) => [...prev, newItem]);

    // clear form + clear error
    setName("");
    setCategory("");
    setPrice("0");
    setError("");
  }

  function onDelete(id) {
    setItems((prev) => prev.filter((it) => it.id !== id));
  }

  return (
    <div className="page">
      <h2 className="title">Item Management</h2>

      <table className="tbl">
        <thead>
          <tr>
            <th className="col-id">ID</th>
            <th>Name</th>
            <th className="col-cat">Category</th>
            <th className="col-price">Price</th>
            <th className="col-action">Action</th>
          </tr>
        </thead>

        <tbody>
          {items.map((it) => (
            <tr key={it.id}>
              <td className="cell-id">{it.id}</td>
              <td>{it.name}</td>
              <td className="cell-cat">
                <img className="cat-icon" src={categoryIcon(it.category)} alt={it.category} />
              </td>
              <td className="cell-price">{it.price.toFixed(2)}</td>
              <td className="cell-action">
                <button
                  className="icon-btn"
                  onClick={() => onDelete(it.id)}
                  title="Delete"
                  aria-label={`Delete ${it.name}`}
                >
                  <img className="del-icon" src={deleteIcon} alt="delete" />
                </button>
              </td>
            </tr>
          ))}

          {/* Form row at this row */}
          <tr className="form-row">
            <td></td>

            <td>
              <input
                className="inp"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </td>

            <td>
              <select
                className="inp"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value=""></option>
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </td>

            <td>
              <input
                className="inp"
                type="number"
                min="0"
                step="0.01"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
            </td>

            <td className="cell-action">
              <button className="add-btn" onClick={onAdd}>
                Add Item
              </button>
            </td>
          </tr>
        </tbody>
      </table>

      {/* Error message just below the table */}
      {error ? <div className="error">{error}</div> : null}
    </div>
  );
}