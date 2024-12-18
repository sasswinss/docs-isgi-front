import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import photo from "../assets/photo.jpg";
import { Link, useNavigate } from "react-router-dom"; // Import de useNavigate
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, database } from "../../firebase-config"; // Import Firebase config
import { ref, set } from "firebase/database"; // Import Firebase Realtime Database
import { TailSpin } from "react-loader-spinner"; // Loader pour feedback visuel

const RegisterForm = () => {
  const navigate = useNavigate(); // Initialisation de useNavigate
  const [isLoading, setIsLoading] = useState(false); // État pour gérer le spinner

  // Formik pour la gestion du formulaire
  const formik = useFormik({
    initialValues: {
      firstname: "",
      surname: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    validationSchema: Yup.object({
      firstname: Yup.string()
        .max(15, "Le prénom ne peut pas dépasser 15 caractères")
        .required("Le prénom est requis"),
      surname: Yup.string()
        .max(20, "Le nom ne peut pas dépasser 20 caractères")
        .required("Le nom est requis"),
      email: Yup.string()
        .email("Adresse e-mail invalide")
        .required("L'e-mail est requis"),
      password: Yup.string()
        .min(6, "Le mot de passe doit contenir au moins 6 caractères")
        .required("Le mot de passe est requis"),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref("password"), null], "Les mots de passe ne correspondent pas")
        .required("La confirmation du mot de passe est requise"),
    }),
    onSubmit: async (values) => {
      setIsLoading(true);
      try {
        // Crée un utilisateur avec email et mot de passe
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          values.email,
          values.password
        );

        const user = userCredential.user;

        // Sauvegarde des données utilisateur dans Realtime Database
        const userRef = ref(database, `users/${user.uid}`);
        await set(userRef, {
          firstname: values.firstname,
          surname: values.surname,
          email: values.email,
          createdAt: new Date().toISOString(),
        });

        // Notifier le succès
        toast.success("Inscription réussie !", {
          position: "top-right",
          autoClose: 2000,
        });

        setIsLoading(false);

        // Redirection vers la page de connexion
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      } catch (error) {
        setIsLoading(false);

        // Gestion des erreurs
        if (error.code === "auth/email-already-in-use") {
          toast.error("L'adresse e-mail est déjà utilisée.", {
            position: "top-right",
          });
        } else if (error.code === "auth/weak-password") {
          toast.error("Le mot de passe est trop faible.", {
            position: "top-right",
          });
        } else {
          toast.error("Une erreur est survenue.", {
            position: "top-right",
          });
        }
        console.error("Erreur Firebase :", error.message);
      }
    },
  });

  return (
    <div className="flex flex-col lg:flex-row w-11/12 max-w-5xl bg-white py-5 shadow rounded-lg overflow-hidden">
      {/* Section gauche */}
      <div
        className="lg:w-1/2 w-full h-60 lg:h-auto bg-cover bg-center"
        style={{
          backgroundImage: `url('${photo}')`,
        }}
      ></div>

      {/* Section droite */}
      <div className="lg:w-1/2 w-full p-6 sm:p-8">
        <h2 className="text-2xl lg:text-3xl font-bold text-gray-800 mb-4">
          Inscrivez-vous
        </h2>
        <p className="text-sm lg:text-base text-gray-600 mb-6">
          Créez votre compte et commencez dès maintenant.
        </p>
        <form onSubmit={formik.handleSubmit}>
          {/* Prénom et Nom */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <input
                type="text"
                name="firstname"
                placeholder="Votre prénom"
                className={`border ${
                  formik.touched.firstname && formik.errors.firstname
                    ? "border-red-500"
                    : "border-gray-300"
                } rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-purple-400`}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.firstname}
              />
              {formik.touched.firstname && formik.errors.firstname && (
                <p className="text-red-500 text-xs mt-1">{formik.errors.firstname}</p>
              )}
            </div>
            <div>
              <input
                type="text"
                name="surname"
                placeholder="Votre nom"
                className={`border ${
                  formik.touched.surname && formik.errors.surname
                    ? "border-red-500"
                    : "border-gray-300"
                } rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-purple-400`}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.surname}
              />
              {formik.touched.surname && formik.errors.surname && (
                <p className="text-red-500 text-xs mt-1">{formik.errors.surname}</p>
              )}
            </div>
          </div>

          {/* Email */}
          <div className="mb-4">
            <input
              type="email"
              name="email"
              placeholder="Votre e-mail"
              className={`border ${
                formik.touched.email && formik.errors.email
                  ? "border-red-500"
                  : "border-gray-300"
              } rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-purple-400`}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.email}
            />
            {formik.touched.email && formik.errors.email && (
              <p className="text-red-500 text-xs mt-1">{formik.errors.email}</p>
            )}
          </div>

          {/* Mot de passe */}
          <div className="mb-4">
            <input
              type="password"
              name="password"
              placeholder="Mot de passe"
              className={`border ${
                formik.touched.password && formik.errors.password
                  ? "border-red-500"
                  : "border-gray-300"
              } rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-purple-400`}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.password}
            />
            {formik.touched.password && formik.errors.password && (
              <p className="text-red-500 text-xs mt-1">{formik.errors.password}</p>
            )}
          </div>

          {/* Confirmation mot de passe */}
          <div className="mb-6">
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirmez votre mot de passe"
              className={`border ${
                formik.touched.confirmPassword && formik.errors.confirmPassword
                  ? "border-red-500"
                  : "border-gray-300"
              } rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-purple-400`}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.confirmPassword}
            />
            {formik.touched.confirmPassword && formik.errors.confirmPassword && (
              <p className="text-red-500 text-xs mt-1">{formik.errors.confirmPassword}</p>
            )}
          </div>

          {/* Bouton de soumission */}
          <button
            type="submit"
            className="bg-purple-600 text-white w-full py-2 rounded-lg hover:bg-purple-500 transition duration-300 flex items-center justify-center"
            disabled={isLoading}
          >
            {isLoading ? <TailSpin height="20" width="20" color="#ffffff" /> : "S'inscrire"}
          </button>

        </form>

        {/* Lien vers connexion */}
        <p className="text-sm text-center text-gray-500 mt-4">
          Vous avez déjà un compte ?{" "}
          <Link to="/login" className="text-purple-600 hover:text-purple-500">
            Connexion
          </Link>
        </p>
      </div>

      {/* ToastContainer */}
      <ToastContainer />
    </div>
  );
};

export default RegisterForm;
