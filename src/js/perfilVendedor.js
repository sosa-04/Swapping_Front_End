document.addEventListener("DOMContentLoaded", () => {
    // Variables globales
    const API_BASE_URL = "http://localhost:8081"
    const catalogos = {
      almacenamientos: [],
      colores: [],
      marcas: [],
      categorias: [],
    }
  
    // Obtener información del usuario desde localStorage
    let usuarioActual = null
    let idUsuarioActual = null
  
    // Referencias a elementos del DOM
    const modal = document.getElementById("productModal")
    const createBtn = document.getElementById("createProductBtn")
    const closeModal = document.querySelector(".close-modal")
    const cancelBtn = document.querySelector(".cancel-btn")
    const productForm = document.getElementById("productForm")
    const modalTitle = document.getElementById("modalTitle")
    const productsGrid = document.getElementById("productsGrid")
    const loadingIndicator = document.getElementById("loadingIndicator")
  
    // Inicializar la aplicación
    init()
  
    async function init() {
      showLoading(true)
      try {
        // Verificar autenticación primero
        if (!verificarAutenticacion()) {
          return
        }
  
        // Cargar catálogos en paralelo
        await Promise.all([cargarAlmacenamientos(), cargarColores(), cargarMarcas(), cargarCategorias()])
  
        // Cargar productos del vendedor
        await cargarProductos()
  
        // Inicializar eventos
        initEventListeners()
      } catch (error) {
        console.error("Error al inicializar la aplicación:", error)
        mostrarError("Hubo un problema al cargar los datos. Por favor, intenta de nuevo más tarde.")
      } finally {
        showLoading(false)
      }
    }
  
    // Función para verificar la autenticación
    function verificarAutenticacion() {
      try {
        // Verificar si existe información del usuario
        const usuarioString = localStorage.getItem("usuario")
  
        if (!usuarioString) {
          console.error("No se encontró información del usuario")
          window.location.href = "/src/view/login.html"
          return false
        }
  
        // Parsear la información del usuario
        usuarioActual = JSON.parse(usuarioString)
        idUsuarioActual = usuarioActual.idusuario
  
        // Verificar si el usuario es un vendedor
        if (!usuarioActual.roles || usuarioActual.roles.idrol !== 2) {
          console.error("El usuario no tiene rol de vendedor")
          window.location.href = "/src/view/catalogoUsuario.html"
          return false
        }
  
        // Actualizar la interfaz con la información del usuario
        actualizarInterfazUsuario(usuarioActual)
        return true
      } catch (error) {
        console.error("Error al verificar autenticación:", error)
        window.location.href = "/src/view/login.html"
        return false
      }
    }
  
    // Función para actualizar la interfaz con la información del usuario
    function actualizarInterfazUsuario(usuario) {
      console.log("Actualizando interfaz con datos de usuario:", usuario.primernombre)
  
      // Actualizar nombre de usuario en la barra de navegación
      const userNameElement = document.querySelector(".user-name")
      if (userNameElement && usuario.primernombre) {
        userNameElement.textContent = `${usuario.primernombre} ${usuario.primerapellido || ""}`
      }
  
      // Actualizar información del perfil
      const profileNameElement = document.querySelector(".profile-card h3")
      if (profileNameElement) {
        profileNameElement.textContent =
          `${usuario.primernombre} ${usuario.segundonombre || ""} ${usuario.primerapellido || ""} ${usuario.segundoapellido || ""}`.trim()
      }
  
      // Actualizar foto de perfil si existe
      const profileImageElement = document.querySelector(".profile-image img")
      if (profileImageElement && usuario.fotoperfil) {
        profileImageElement.src = usuario.fotoperfil
      }
  
      // Actualizar información de contacto
      const userEmailElement = document.getElementById("userEmail")
      if (userEmailElement && usuario.email) {
        userEmailElement.textContent = usuario.email
      }
  
      const userPhoneElement = document.getElementById("userPhone")
      if (userPhoneElement && usuario.telefono) {
        userPhoneElement.textContent = usuario.telefono
      }
  
      // Actualizar descripción
      const userDescriptionElement = document.getElementById("userDescription")
      if (userDescriptionElement) {
        userDescriptionElement.textContent = usuario.descripcion || "Sin descripción"
      }
  
      // Actualizar calificación si existe
      if (usuario.calificacion !== undefined) {
        const ratingElements = document.querySelectorAll(".profile-card .rating i")
        const calificacion = Math.round(usuario.calificacion)
  
        ratingElements.forEach((element, index) => {
          if (index < calificacion) {
            element.classList.remove("far")
            element.classList.add("fas")
          } else {
            element.classList.remove("fas")
            element.classList.add("far")
          }
        })
  
        const ratingCountElement = document.querySelector(".profile-card .rating span")
        if (ratingCountElement) {
          ratingCountElement.textContent = `(${calificacion})`
        }
      }
    }
  
    // Función para cargar almacenamientos
    async function cargarAlmacenamientos() {
      try {
        const response = await fetch(`${API_BASE_URL}/api/almacenamientos/obtenerAlmacenamientos`)
        if (!response.ok) {
          throw new Error(`Error HTTP: ${response.status}`)
        }
  
        catalogos.almacenamientos = await response.json()
        console.log("Almacenamientos cargados:", catalogos.almacenamientos.length)
  
        // Llenar el dropdown de almacenamientos
        const select = document.getElementById("productStorage")
        select.innerHTML = '<option value="">Seleccionar almacenamiento</option>'
  
        catalogos.almacenamientos.forEach((almacenamiento) => {
          const option = document.createElement("option")
          option.value = almacenamiento.idalmacenamiento
          option.textContent = almacenamiento.tamanioalmacenamiento
          select.appendChild(option)
        })
      } catch (error) {
        console.error("Error al cargar almacenamientos:", error)
        throw error
      }
    }
  
    // Función para cargar colores
    async function cargarColores() {
      try {
        const response = await fetch(`${API_BASE_URL}/api/colores/obtenerColores`)
        if (!response.ok) {
          throw new Error(`Error HTTP: ${response.status}`)
        }
  
        catalogos.colores = await response.json()
        console.log("Colores cargados:", catalogos.colores.length)
  
        // Llenar el dropdown de colores
        const select = document.getElementById("productColor")
        select.innerHTML = '<option value="">Seleccionar color</option>'
  
        catalogos.colores.forEach((color) => {
          const option = document.createElement("option")
          option.value = color.idcolor
          option.textContent = color.nombre
          select.appendChild(option)
        })
      } catch (error) {
        console.error("Error al cargar colores:", error)
        throw error
      }
    }
  
    // Función para cargar marcas
    async function cargarMarcas() {
      try {
        const response = await fetch(`${API_BASE_URL}/api/marcas/obtenerMarcas`)
        if (!response.ok) {
          throw new Error(`Error HTTP: ${response.status}`)
        }
  
        catalogos.marcas = await response.json()
        console.log("Marcas cargadas:", catalogos.marcas.length)
  
        // Llenar el dropdown de marcas
        const select = document.getElementById("productBrand")
        select.innerHTML = '<option value="">Seleccionar marca</option>'
  
        catalogos.marcas.forEach((marca) => {
          const option = document.createElement("option")
          option.value = marca.idmarca
          option.textContent = marca.nombre
          select.appendChild(option)
        })
      } catch (error) {
        console.error("Error al cargar marcas:", error)
        throw error
      }
    }
  
    // Función para cargar categorías
    async function cargarCategorias() {
      try {
        const response = await fetch(`${API_BASE_URL}/api/categorias/obtenerCategorias`)
        if (!response.ok) {
          throw new Error(`Error HTTP: ${response.status}`)
        }
  
        catalogos.categorias = await response.json()
        console.log("Categorías cargadas:", catalogos.categorias.length)
  
        // Llenar el dropdown de categorías
        const select = document.getElementById("productCategory")
        select.innerHTML = '<option value="">Seleccionar categoría</option>'
  
        catalogos.categorias.forEach((categoria) => {
          const option = document.createElement("option")
          option.value = categoria.idcategoria
          option.textContent = categoria.nombre
          select.appendChild(option)
        })
      } catch (error) {
        console.error("Error al cargar categorías:", error)
        throw error
      }
    }
  
    // Función para cargar productos del vendedor
    async function cargarProductos() {
      try {
        // Verificar que tenemos el ID de usuario
        if (!idUsuarioActual) {
          throw new Error("No se pudo identificar al usuario actual. Por favor, inicie sesión nuevamente.")
        }
  
        console.log("Cargando productos para el vendedor ID:", idUsuarioActual)
  
        const response = await fetch(`${API_BASE_URL}/api/productos/productosXvendedor?idVendedor=${idUsuarioActual}`)
  
        if (!response.ok) {
          // Si hay un error de autenticación, redirigir al login
          if (response.status === 401 || response.status === 403) {
            console.error("Error de autenticación:", response.status)
            cerrarSesion()
            return
          }
          throw new Error(`Error HTTP: ${response.status}`)
        }
  
        const productos = await response.json()
        console.log("Productos cargados:", productos.length)
  
        // Limpiar la cuadrícula de productos
        if (productsGrid) {
          productsGrid.innerHTML = ""
  
          // Mostrar los productos
          if (productos.length === 0) {
            productsGrid.innerHTML =
              "<p class='no-products'>No tienes productos registrados. ¡Crea tu primer producto!</p>"
          } else {
            productos.forEach((producto) => {
              agregarProductoALaGrilla(producto)
            })
          }
        }
      } catch (error) {
        console.error("Error al cargar productos:", error)
        mostrarError(error.message || "No se pudieron cargar los productos. Por favor, intenta de nuevo más tarde.")
      }
    }
  
    // Función para agregar un producto a la grilla
    function agregarProductoALaGrilla(producto) {
      const productCard = document.createElement("div")
      productCard.classList.add("product-card")
      productCard.dataset.productId = producto.idproducto
  
      let imageUrl = "https://via.placeholder.com/150"
      if (producto.fotos && producto.fotos.length > 0) {
        // Verificar si fotos es un array de objetos con propiedad url o un array de strings
        if (typeof producto.fotos[0] === "object" && producto.fotos[0].url) {
          imageUrl = producto.fotos[0].url
        } else if (typeof producto.fotos[0] === "string") {
          imageUrl = producto.fotos[0]
        }
      }
      console.log("URL de imagen:", imageUrl)
  
      productCard.innerHTML = `
        <img src="${imageUrl}" alt="${producto.nombre}">
        <h3>${producto.nombre}</h3>
        <p class="product-price">Precio: L ${producto.precio}</p>
        <p class="product-stock">Stock: ${producto.stock}</p>
        <div class="product-actions">
          <button class="edit-btn"><i class="fas fa-edit"></i> Editar</button>
          <button class="delete-btn"><i class="fas fa-trash"></i> Eliminar</button>
        </div>
      `
  
      // Agregar eventos para editar y eliminar
      const editBtn = productCard.querySelector(".edit-btn")
      editBtn.addEventListener("click", () => editarProducto(producto.idproducto))
  
      const deleteBtn = productCard.querySelector(".delete-btn")
      deleteBtn.addEventListener("click", () => eliminarProducto(producto.idproducto))
  
      productsGrid.appendChild(productCard)
    }
  
    // Función para editar un producto
    async function editarProducto(idProducto) {
      modalTitle.textContent = "Editar Producto"
      productForm.reset()
      modal.style.display = "block"
  
      try {
        const response = await fetch(`${API_BASE_URL}/api/productos/productosXid?idproducto=${idProducto}`)
  
        if (!response.ok) {
          // Si hay un error de autenticación, redirigir al login
          if (response.status === 401 || response.status === 403) {
            cerrarSesion()
            return
          }
          throw new Error(`Error HTTP: ${response.status}`)
        }
  
        const producto = await response.json()
  
        // Llenar el formulario con los datos del producto
        document.getElementById("productName").value = producto.nombre
        document.getElementById("productDescription").value = producto.descripcion
        document.getElementById("productPrice").value = producto.precio
        document.getElementById("productStock").value = producto.stock
        document.getElementById("productStorage").value =
          producto.idAlmacenamiento || (producto.almacenamiento ? producto.almacenamiento.idalmacenamiento : "")
        document.getElementById("productColor").value = producto.idColor || (producto.color ? producto.color.idcolor : "")
        document.getElementById("productBrand").value = producto.idMarca || (producto.marca ? producto.marca.idmarca : "")
        document.getElementById("productCategory").value = producto.idCategoria || ""
        document.getElementById("productModel").value = producto.modelo ? producto.modelo.nombre : ""
  
        // Llenar las fotos
        const fotosContainer = document.getElementById("fotosContainer")
        fotosContainer.innerHTML = "" // Limpiar las fotos existentes
  
        if (producto.fotos && producto.fotos.length > 0) {
          producto.fotos.forEach((foto) => {
            const fotoUrl = typeof foto === "object" && foto.url ? foto.url : foto
            const newFotoContainer = document.createElement("div")
            newFotoContainer.classList.add("foto-input-container")
            newFotoContainer.innerHTML = `
              <input type="text" class="foto-url" placeholder="URL de la imagen" value="${fotoUrl}">
              <button type="button" class="remove-foto-btn">
                <i class="fas fa-times"></i>
              </button>
            `
            fotosContainer.appendChild(newFotoContainer)
  
            // Agregar evento para eliminar la foto
            const removeBtn = newFotoContainer.querySelector(".remove-foto-btn")
            removeBtn.addEventListener("click", (e) => {
              e.target.closest(".foto-input-container").remove()
            })
          })
        }
  
        // Agregar el botón para añadir más fotos
        const addFotoBtn = document.createElement("button")
        addFotoBtn.type = "button"
        addFotoBtn.id = "addFotoBtn"
        addFotoBtn.innerHTML = '<i class="fas fa-plus"></i> Añadir otra foto'
        fotosContainer.appendChild(addFotoBtn)
        addFotoBtn.addEventListener("click", agregarCampoFoto)
  
        // Guardar el ID del producto en el formulario
        productForm.dataset.productId = idProducto
      } catch (error) {
        console.error("Error al cargar el producto para editar:", error)
        mostrarError("No se pudo cargar el producto para editar. Por favor, intenta de nuevo.")
      }
    }
  
    // Función para eliminar un producto
    async function eliminarProducto(idProducto) {
      if (confirm("¿Estás seguro de que quieres eliminar este producto?")) {
        showLoading(true)
  
        try {
          const response = await fetch(`${API_BASE_URL}/api/productos/${idProducto}`, {
            method: "DELETE",
          })
  
          if (!response.ok) {
            // Si hay un error de autenticación, redirigir al login
            if (response.status === 401 || response.status === 403) {
              cerrarSesion()
              return
            }
            throw new Error(`Error HTTP: ${response.status}`)
          }
  
          // Eliminar el producto de la grilla
          const productCard = document.querySelector(`.product-card[data-product-id="${idProducto}"]`)
          if (productCard) {
            productCard.remove()
          }
  
          mostrarExito("Producto eliminado con éxito.")
        } catch (error) {
          console.error("Error al eliminar el producto:", error)
          mostrarError("No se pudo eliminar el producto. Por favor, intenta de nuevo.")
        } finally {
          showLoading(false)
        }
      }
    }
  
    // Función para agregar un nuevo campo de foto
    function agregarCampoFoto() {
      const fotosContainer = document.getElementById("fotosContainer")
      const newFotoContainer = document.createElement("div")
      newFotoContainer.classList.add("foto-input-container")
      newFotoContainer.innerHTML = `
        <input type="text" class="foto-url" placeholder="URL de la imagen">
        <button type="button" class="remove-foto-btn">
          <i class="fas fa-times"></i>
        </button>
      `
  
      // Insertar antes del botón de añadir si existe
      const addFotoBtn = document.getElementById("addFotoBtn")
      if (addFotoBtn) {
        fotosContainer.insertBefore(newFotoContainer, addFotoBtn)
      } else {
        fotosContainer.appendChild(newFotoContainer)
      }
  
      // Agregar evento para eliminar la foto
      const removeBtn = newFotoContainer.querySelector(".remove-foto-btn")
      removeBtn.addEventListener("click", (e) => {
        e.target.closest(".foto-input-container").remove()
      })
    }
  
    // Manejar el envío del formulario
    async function handleFormSubmit(event) {
      event.preventDefault()
  
      showLoading(true)
  
      try {
        const fotos = []
        const fotoUrls = document.querySelectorAll(".foto-url")
        fotoUrls.forEach((urlInput) => {
          if (urlInput.value) {
            fotos.push({ url: urlInput.value })
          }
        })
  
        // Crear el objeto con los nombres exactos de parámetros que espera la API
        const producto = {
          descripcion: document.getElementById("productDescription").value,
          precio: Number.parseFloat(document.getElementById("productPrice").value),
          stock: Number.parseInt(document.getElementById("productStock").value),
          idAlmacenamiento: Number.parseInt(document.getElementById("productStorage").value),
          idColor: Number.parseInt(document.getElementById("productColor").value),
          modelo: {
            idmodelo: 0, // El backend asignará el ID si es nuevo
            nombre: document.getElementById("productModel").value,
          },
          idMarca: Number.parseInt(document.getElementById("productBrand").value),
          idCategoria: Number.parseInt(document.getElementById("productCategory").value),
          idUsuario: idUsuarioActual,
          fotos: fotos,
        }
  
        const productId = productForm.dataset.productId
  
        const url = `${API_BASE_URL}/api/productos/guardarProducto`
        const method = "POST"
  
        if (productId) {
          producto.idproducto = Number.parseInt(productId)
        }
  
        console.log("Enviando producto:", producto)
  
        const response = await fetch(url, {
          method: method,
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(producto),
        })
  
        if (!response.ok) {
          // Si hay un error de autenticación, redirigir al login
          if (response.status === 401 || response.status === 403) {
            cerrarSesion()
            return
          }
          throw new Error(`Error HTTP: ${response.status}`)
        }
  
        const responseData = await response.json()
        console.log("Respuesta del servidor:", responseData)
  
        // Cerrar el modal
        modal.style.display = "none"
  
        // Recargar los productos
        await cargarProductos()
  
        mostrarExito(productId ? "Producto actualizado con éxito." : "Producto creado con éxito.")
      } catch (error) {
        console.error("Error al guardar el producto:", error)
        mostrarError(error.message || "No se pudo guardar el producto. Por favor, intenta de nuevo más tarde.")
      } finally {
        showLoading(false)
      }
    }
  
    // Función para cerrar sesión
    function cerrarSesion() {
      // Eliminar datos de autenticación
      localStorage.removeItem("authToken")
      localStorage.removeItem("token")
      sessionStorage.removeItem("authToken")
      sessionStorage.removeItem("token")
      localStorage.removeItem("usuario")
  
      // Redirigir a la página de inicio de sesión
      window.location.href = "/src/view/login.html"
    }
  
    // Inicializar eventos
    function initEventListeners() {
      // Abrir modal para crear un nuevo producto
      if (createBtn) {
        createBtn.addEventListener("click", () => {
          modalTitle.textContent = "Crear Nuevo Producto"
          productForm.reset() // Limpiar formulario
  
          // Reiniciar el contenedor de fotos
          const fotosContainer = document.getElementById("fotosContainer")
          if (fotosContainer) {
            fotosContainer.innerHTML = `
              <div class="foto-input-container">
                <input type="text" class="foto-url" placeholder="URL de la imagen">
                <button type="button" class="remove-foto-btn" style="display: none;">
                  <i class="fas fa-times"></i>
                </button>
              </div>
              <button type="button" id="addFotoBtn">
                <i class="fas fa-plus"></i> Añadir otra foto
              </button>
            `
          }
  
          // Reiniciar el ID del producto en edición
          productForm.dataset.productId = ""
  
          modal.style.display = "block"
  
          // Inicializar el botón de añadir foto
          const addFotoBtn = document.getElementById("addFotoBtn")
          if (addFotoBtn) {
            addFotoBtn.addEventListener("click", agregarCampoFoto)
          }
        })
      }
  
      // Cerrar modal al hacer clic en X
      if (closeModal) {
        closeModal.addEventListener("click", () => {
          modal.style.display = "none"
        })
      }
  
      // Cerrar modal al hacer clic en Cancelar
      if (cancelBtn) {
        cancelBtn.addEventListener("click", () => {
          modal.style.display = "none"
        })
      }
  
      // Cerrar modal al hacer clic fuera
      window.addEventListener("click", (event) => {
        if (event.target === modal) {
          modal.style.display = "none"
        }
      })
  
      // Manejar envío del formulario
      if (productForm) {
        productForm.addEventListener("submit", handleFormSubmit)
      }
  
      // Añadir evento para el botón de cerrar sesión
      const logoutBtn = document.getElementById("logoutBtn")
      if (logoutBtn) {
        logoutBtn.addEventListener("click", cerrarSesion)
      }
    }
  
    // Función para mostrar/ocultar indicador de carga
    function showLoading(show) {
      if (loadingIndicator) {
        loadingIndicator.style.display = show ? "flex" : "none"
      }
    }
  
    // Función para mostrar mensajes de error
    function mostrarError(mensaje) {
      alert(mensaje) // Puedes reemplazar esto con una implementación más elegante
    }
  
    // Función para mostrar mensajes de éxito
    function mostrarExito(mensaje) {
      alert(mensaje) // Puedes reemplazar esto con una implementación más elegante
    }
  })