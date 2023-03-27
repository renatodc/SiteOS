Para agregar una presentación de diapositivas a la página principal:
-Abrir index.html.
-La sección de presentación de diapositivas está en una etiqueta <section> con el nombre de clase "hero-section". Descomente esta etiqueta <section>. La sección de presentación de diapositivas viene con 3 diapositivas por defecto. Modifíquelos según sea necesario.
-Retire el nombre de clase "header-normal" de la etiqueta <header>.
-Comente la <sección> con el nombre de clase "breadcrumb-section" justo debajo de la sección de presentación de diapositivas para ocultarla.

Para modificar los filtros del horario:
-Abra horario.html.
-Encuentre la etiqueta <section> con el nombre de clase "classtime-section". Este contiene la sección del horario.
-En la sección de programación, busque la etiqueta <div> con el nombre de clase "horarios-controles". Este contiene una lista de filtros. Cada elemento de la lista tiene un atributo llamado data-tsfilter. Establezca un identificador único para este atributo.
-Debajo de la etiqueta <div> con el nombre de clase "horario-controles", hay una etiqueta <div> con el nombre de clase "classtime-table" que contiene el horario real en una etiqueta <table>. En esta etiqueta <table>, cada etiqueta <td> interna representa un intervalo de tiempo de clase. Cada etiqueta <td> tiene un atributo llamado data-tsmeta. Establezca el valor de filtro correspondiente del atributo data-tsfilter establecido anteriormente como el valor para el atributo data-tsmeta.

Para agregar testimonios:
-Abre about-us.html.
-Encuentre las etiquetas <section> con el nombre de clase "testimonial-section". Hay 2 instancias de etiqueta.
-Comente o elimine la primera etiqueta <section>.
-Descomenta la segunda etiqueta <section>. La sección de testimonios viene con 3 testimonios por defecto. Modifíquelos según sea necesario.