import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import "./Dealers.css";
import "../assets/style.css";
import Header from '../Header/Header';

const PostReview = () => {
  const [dealer, setDealer] = useState({});
  const [review, setReview] = useState("");
  const [model, setModel] = useState("");
  const [year, setYear] = useState("");
  const [date, setDate] = useState("");
  const [carmodels, setCarmodels] = useState([]);

  let curr_url = window.location.href;
  let root_url = curr_url.substring(0, curr_url.indexOf("postreview"));
  let params = useParams();
  let id = params.id;
  let dealer_url = root_url + `djangoapp/dealer/${id}`;
  let review_url = root_url + `djangoapp/add_review`;
  let carmodels_url = root_url + `djangoapp/get_cars`;

  const postreview = async () => {
    let name = sessionStorage.getItem("firstname") + " " + sessionStorage.getItem("lastname");
    
    // Si el nombre o apellido están guardados como null, se utiliza el username
    if (name.includes("null") || name.trim() === "") {
      name = sessionStorage.getItem("username");
    }

    if (!model || review === "" || date === "" || year === "") {
      alert("All details are mandatory");
      return;
    }

    let model_split = model.split(" ");
    let make_chosen = model_split[0];
    let model_chosen = model_split.slice(1).join(" "); // Maneja nombres de modelos con espacios

    let jsoninput = JSON.stringify({
      "name": name,
      "dealership": parseInt(id), // <--- CAMBIO AQUÍ: Convertir a entero
      "review": review,
      "purchase": true,
      "purchase_date": date,
      "car_make": make_chosen,
      "car_model": model_chosen,
      "car_year": parseInt(year), // <--- CAMBIO AQUÍ: Convertir a entero
    });

    console.log("Posting review:", jsoninput);
    const res = await fetch(review_url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: jsoninput,
    });

    const json = await res.json();
    if (json.status === 200) {
      window.location.href = window.location.origin + "/dealer/" + id;
    }
  };

  const get_dealer = async () => {
    const res = await fetch(dealer_url, {
      method: "GET"
    });
    const retobj = await res.json();
    
    if (retobj.status === 200) {
      let dealerobjs = Array.from(retobj.dealer);
      if (dealerobjs.length > 0) {
        setDealer(dealerobjs[0]);
      }
    }
  };

  const get_cars = async () => {
    const res = await fetch(carmodels_url, {
      method: "GET"
    });
    const retobj = await res.json();
    
    if (retobj.CarModels) {
      let carmodelsarr = Array.from(retobj.CarModels);
      setCarmodels(carmodelsarr);
    }
  };

  useEffect(() => {
    get_dealer();
    get_cars();
  }, []);

  return (
    <div>
      <Header />
      <div style={{ margin: "5%", maxWidth: "600px" }}>
        <h1 style={{ color: "darkblue", marginBottom: "20px" }}>
          {dealer.full_name ? `Write a review for ${dealer.full_name}` : "Write a review"}
        </h1>
        
        <div style={{ marginBottom: "15px" }}>
          <label style={{ display: "block", fontWeight: "bold" }}>Review:</label>
          <textarea 
            id='review' 
            cols='60' 
            rows='7' 
            onChange={(e) => setReview(e.target.value)}
            style={{ width: "100%", padding: "10px", marginTop: "5px" }}
          ></textarea>
        </div>

        <div className='input_field' style={{ marginBottom: "15px" }}>
          <label style={{ fontWeight: "bold" }}>Purchase Date: </label>
          <input type="date" onChange={(e) => setDate(e.target.value)} style={{ marginLeft: "10px" }} />
        </div>

        <div className='input_field' style={{ marginBottom: "15px" }}>
          <label style={{ fontWeight: "bold" }}>Car Make & Model: </label>
          <select 
            name="cars" 
            id="cars" 
            defaultValue="" 
            onChange={(e) => setModel(e.target.value)}
            style={{ marginLeft: "10px", padding: "5px" }}
          >
            <option value="" disabled hidden>Choose Car Make and Model</option>
            {carmodels.map((carmodel, index) => (
              <option key={index} value={carmodel.CarMake + " " + carmodel.CarModel}>
                {carmodel.CarMake} {carmodel.CarModel}
              </option>
            ))}
          </select>        
        </div>

        <div className='input_field' style={{ marginBottom: "20px" }}>
          <label style={{ fontWeight: "bold" }}>Car Year: </label>
          <input 
            type="number" 
            onChange={(e) => setYear(e.target.value)} 
            max={2026} 
            min={2015} 
            style={{ marginLeft: "10px", padding: "5px", width: "80px" }}
          />
        </div>

        <div>
          <button className='postreview' onClick={postreview} style={{ padding: "10px 20px", cursor: "pointer" }}>
            Post Review
          </button>
        </div>
      </div>
    </div>
  );
};

export default PostReview;