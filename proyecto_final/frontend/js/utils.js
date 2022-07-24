(() => {
  const Utils = {
    settings:  {
      backendBaseUrl: "http://localhost:3000/api",
    },
    getFormattedBackendUrl: ({ query }) => {
      return `${Utils.settings.backendBaseUrl}/${query}`;
    },
    getYappy: async ({paramYappy}) => {
      query = "yappy"
      const response = axios.post(Utils.getFormattedBackendUrl( {query} ), paramYappy);
      return response;
    },
    getPedidos: async () => {
      query = "pedidos"
      const response = axios.get(Utils.getFormattedBackendUrl( {query} ));
      return response;
    },
    getProductos: async () => {
      query = "articulos/all"
      const url = Utils.getFormattedBackendUrl( {query} );
      const rawResponse = await Utils.responseDataUrl(url);
      const baseDeDatos = rawResponse.articulos;
      return (baseDeDatos);
    },
    obtainUserInfo: async (email) => {
      query = "usuarios/one"
      const response = axios.post(Utils.getFormattedBackendUrl( {query} ), email);
      return response;
    },
    postFile: async ({ formData }) => {
      query = "archivos"
      const response = axios.post(Utils.getFormattedBackendUrl( {query} ), formData);
      return response;
    },
    postPedido: async ({ pedido }) => {
      query = "pedidos"
      const response = axios.post(Utils.getFormattedBackendUrl( {query} ), pedido);
      console.log(response);
      return response;
    },
    postSuscripcion: async ({ suscriptor }) => {
      query = "suscripcion"
      const response = axios.post(Utils.getFormattedBackendUrl( {query} ), suscriptor);
      return response;
    },
    postProducto: async ({ producto }) => {
      query = "articulos"
      const response = axios.post(Utils.getFormattedBackendUrl( {query} ), producto);
      return response;
    },
    postUsuario: async ({ usuario }) => {
      query = "usuarios"
      const response = axios.post(Utils.getFormattedBackendUrl( {query} ), usuario);
      return response;
    },
    postUsuarioLogin: async ({ usuario }) => {
      query = "auth/login"
      const response = axios.post(Utils.getFormattedBackendUrl( {query} ), usuario);
      return response;
    },
    fetch: async ({ url }) => {
      try {
        const rawResponse = await fetch(url);
        if (rawResponse.status !== 200) {
          throw new Error(`not found`);
        }
        return rawResponse.json();
      } catch (error) {
        throw error;
      }
    },
    responseDataUrl: async (url) => {
      try {
        const { data } = await axios.get(url);
        response = data;
      } catch {
        response = 'Not Found';
      }
      return response;
    },
  };
  document.Utils = Utils;
})();