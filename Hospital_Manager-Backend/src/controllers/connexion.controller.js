import users from "../data/users.json" with { type: "json" };

// const currentUser = JSON.parse(localStorage.getItem('medicalUser')) || []
// const isAuthentificated= localStorage.getItem('medicalAuth')

export const login = (req, res) => {
  const newuser = req.body;
  const user = users.find(
    (us) => us.email == newuser.email && us.password == newuser.password,
  );
  
  if (user) {
    res.status(200).json({data: user})
  } else {
    res.status(401).json({message: 'bad request'})
  }
};

// export const logout = () => {
//   isAuthentificated = localStorage.removeItem("medicalAuth");
//   localStorage.removeItem("medicalUser");
// };
