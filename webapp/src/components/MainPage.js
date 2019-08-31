import React from 'react';

class Basiccomponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {

    }
  }
    render(){
        return (
        <div>
      
      <nav class="navbar navbar-expand-lg navbar-light bg-light" >
  <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
    <span class="navbar-toggler-icon"></span>
  </button>

  <div class="collapse navbar-collapse" id="navbarSupportedContent" >
    <ul class="navbar-nav mr-auto" >
      <li class="nav-item active">
        <button class="nav-link" href="#">Home <span class="sr-only">(current)</span></button>
      </li>
      <li class="nav-item active">
        <button class="nav-link" href="#">Player Profiles <span class="sr-only">(current)</span></button>
      </li>
      <li class="nav-item active">
        <button class="nav-link" href="#">Stats <span class="sr-only">(current)</span></button>
      </li>
      <li class="nav-item active">
        <button class="nav-link" href="#">Feedback <span class="sr-only">(current)</span></button>
      </li>
    </ul>
    <form class="form-inline my-2 my-lg-0">
      <input class="" type="search" placeholder="Search" aria-label="Search" />
      <button class="" type="submit">Search</button>
    </form>
  </div>
</nav>
            </div>
        )
    }
}

export default Basiccomponent;
