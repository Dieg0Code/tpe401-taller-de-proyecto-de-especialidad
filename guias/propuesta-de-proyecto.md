# La propuesta de proyecto

Una **propuesta de proyecto** es el documento con que se le presenta un proyecto a quien tiene que
decidir si lo aprueba o lo financia: el dueño de una organización, un jefe, un fondo público. Dice
qué problema hay, qué se propone, cómo se va a medir el resultado, cuánto cuesta, cuánto demora y
quién hace qué.

Los ejemplos usan un caso ilustrativo: **una ferretería de Osorno que recibe pedidos por WhatsApp
y los anota en un cuaderno**. Los pedidos se pierden, nadie sabe qué falta en bodega y los
clientes llaman para preguntar si su pedido está listo. Cada equipo trabaja con su propio desafío.

En este módulo, el proyecto de cada equipo es **un sistema de software**, y la propuesta no se
escribe aparte de ese software: cada parte registra una etapa de su desarrollo. Lo que dice la
propuesta tiene que poder verse en el software, y al revés.

La propuesta se construye por partes durante todo el módulo y se entrega completa al final, en el
**portafolio**. Al cierre se resume en una presentación, el **Resumen Ejecutivo**, que es el examen.

Los términos en negrita se explican en el **Vocabulario del módulo**.

### Cómo avanzar mientras faltan datos

El equipo comienza con el caso real que entrega el docente, las fuentes disponibles y **supuestos**
explícitos. El contacto con la organización no es condición para avanzar ni para entregar. Un
supuesto es una afirmación provisional que permite tomar una decisión mientras falta información.
Debe indicar qué se supone, en qué se basa y cómo se podría comprobar.

Por ejemplo: «Se supone que una persona registra los pedidos en el mesón, según la descripción del
caso; falta confirmar quién lo hace y si necesita distintos permisos». Con esa base se pueden
definir historias de usuario, diseñar y probar el registro de pedidos. Los datos de prueba deben
estar identificados como ficticios.

Si posteriormente el docente habilita el contacto, el equipo contrasta los supuestos con la
organización y registra lo confirmado, lo corregido y lo que sigue pendiente. Los cambios se
reflejan en las partes afectadas de la propuesta y del software: diagnóstico, alcance, objetivos,
historias de usuario, Canvas o pruebas, según corresponda. Si el contacto no se concreta, se entrega
lo desarrollado con sus evidencias y pendientes de validación declarados.

## 1. El Entregable I: el documento de la propuesta

Es un documento Word, con un formato oficial, que tiene diez puntos. Se completa en tres avances.

| Avance | Punto | Qué responde | Extensión | Etapa del desarrollo |
| --- | --- | --- | --- | --- |
| 1 | 1. **Diagnóstico** | Cuatro preguntas: ¿cuál es el desafío y cómo se puede resolver con lo aprendido en la carrera?, ¿cómo es el entorno o el mercado donde está?, ¿cómo son las personas que se van a beneficiar?, ¿hay alguna **normativa** que afecte al proyecto? Se responde con información del caso, **fuentes secundarias** citadas, **supuestos** identificados y **fuentes primarias** cuando estén disponibles, una **matriz FODA** y el apoyo de herramientas de **IA generativa** | 500 a 700 palabras | Descubrimiento: entender la necesidad y señalar qué falta validar |
| 1 | 2. **Fundamentación** | ¿Por qué es importante hacer este proyecto? | 200 a 400 palabras | Descubrimiento |
| 2 | 3. Definición y **delimitación** del desafío | ¿Cuál es el desafío y desde y hasta dónde se va a abordar? Qué parte se resuelve, en qué grado y qué queda fuera | 150 a 300 palabras | Alcance: qué hará el sistema y qué no |
| 2 | 4. Objetivos | Un **objetivo general** y dos **objetivos específicos**, escritos como **objetivos SMART** | — | Lo que el software tiene que lograr |
| 2 | 5. **Impacto esperado** | Al menos dos resultados esperados, cada uno con su **indicador** | 200 a 500 palabras | Cómo se va a medir si el software sirvió |
| 2 | 6. **Producto esperado** | Qué se va a construir concretamente | 50 a 150 palabras | El sistema: sus funciones principales y sus usuarios |
| 3 | 7. Recursos y **presupuesto** | Los recursos humanos, financieros, materiales y tecnológicos, con cantidad y precio | — | Planificación |
| 3 | 8. **Carta Gantt** | Todas las actividades, con su duración en semanas, en la planilla Excel oficial | — | Planificación: las etapas y entregas del desarrollo |
| 3 | 9. Organización | El responsable de cada actividad de la carta Gantt y el rol que cumple | — | Organización del equipo |
| 3 | 10. **Elevator Pitch** | El guion final del pitch | — | Comunicar el proyecto |

## 2. El Entregable II: el valor del proyecto

| Avance | Pieza | Qué contiene | Etapa del desarrollo |
| --- | --- | --- | --- |
| 1 | **Lienzo Canvas** | Los nueve bloques del proyecto como negocio, en el formato oficial | Diseño: qué valor entrega el sistema y a quién |
| 2 | **Cadena de valor** | Las nueve actividades con que el proyecto produce y entrega su valor, en el formato oficial, y su **proceso crítico** | Construcción y entrega |
| 2 | Avance del producto | Evidencia de lo que ya se construyó del sistema | Construcción |

### Las nueve actividades de la cadena de valor

La cadena de valor describe las actividades del proyecto visto como un servicio que el equipo le
entrega a la organización.

| Tipo | Actividad | Qué es | En el proyecto de la ferretería |
| --- | --- | --- | --- |
| Primaria | Logística de entrada | Cómo se reciben y se guardan los insumos que se necesitan para producir | Recibir los requerimientos de la ferretería y contratar el servidor donde va a correr el sistema |
| Primaria | Operaciones | Cómo se transforman esos insumos en el producto o el servicio | Programar y probar el sistema |
| Primaria | Logística de salida | Cómo llega el producto a quien lo usa | Instalar el sistema en el computador del mesón |
| Primaria | Marketing y ventas | Cómo se da a conocer y se ofrece el producto | Presentar el sistema al dueño y ofrecerlo a otras ferreterías |
| Primaria | Servicios | Lo que se entrega después de la venta | Capacitar a los vendedores y corregir fallas |
| Apoyo | Infraestructura | La planificación, la contabilidad y las finanzas que sostienen al resto | La carta Gantt y el control del presupuesto |
| Apoyo | Gestión de recursos humanos | Cómo se organiza, se capacita y se motiva a las personas | Los roles del equipo y quién aprende qué herramienta |
| Apoyo | Desarrollo tecnológico | Cómo se investiga y se mejora la forma de trabajar | Evaluar qué base de datos o qué servicio de mensajería conviene usar |
| Apoyo | Aprovisionamiento | Cómo se consiguen los insumos y los servicios | Comparar precios de servidores y cotizar el computador |

## 3. El portafolio: la propuesta completa

Es la entrega final de todo lo anterior, en carpetas:

- **Producto del proyecto**: el sistema y su evidencia. Por ejemplo, el código, un video que muestre
  el sistema funcionando, capturas de pantalla, el manual o la capacitación para sus usuarios. Si un
  archivo no se puede subir tal cual, se comprime en ZIP; cuando se pueda, se agrega una copia en
  PDF.
- **Entregables I y II**: el documento de la propuesta, la carta Gantt, el Canvas y la cadena de
  valor, en PDF y en su versión final, con todas las correcciones de la retroalimentación.
- **Evidencias del trabajo**: lo que respalda lo que dice la propuesta, como entrevistas,
  encuestas, cotizaciones, mapas de proceso y la matriz FODA.

## 4. El Resumen Ejecutivo: la presentación final

El **Resumen Ejecutivo** es la presentación con que el equipo expone su proyecto en el examen. Su
propósito es captar en pocos minutos el interés de alguien que podría invertir en el proyecto o
asociarse a él. Se arma en el formato PowerPoint oficial, que viene sin diseño: el equipo diseña el
fondo, la tipografía y los elementos de cada lámina.

| Lámina | Contenido | Tiempo máximo |
| --- | --- | --- |
| 1 | Portada: nombre del proyecto | — |
| 2 | Información general: integrantes, carrera, escuela, sede, docente y una foto del equipo | 1 minuto |
| 3 | Descripción del desafío o necesidad, con el objetivo general y los específicos | 2 minutos |
| 4 | La solución que se propone, fundamentada en el diagnóstico, con el pitch y el Canvas | 3 minutos |
| 5 | La solución técnica: el sistema, con evidencia de que existe y funciona | 6 minutos |
| 6 | Tres conclusiones: la importancia del proyecto, su viabilidad y su **sostenibilidad** | 3 minutos |
| 7 | Preguntas | — |

La exposición dura como máximo 15 minutos, y 20 con las preguntas. Puede presentar un
representante del equipo o todos, siempre que cada uno exponga contenido real y no solo haga de
nexo entre láminas.
