# js-library-cinarayd

Link to my landing page: https://kaancinar.me/kaan.js/examples.html


Directlink to my documentation: https://kaancinar.me/kaan.js/documentation.html


Getting Started: 



<div style="margin: 10px">
        To use this library, all you need is jQuery, and this library itself, no
        other external js or css file is required. Here are some code snippets
        showing some basic library functionality:
      </div>
      <ul>
        <li>
          Creating an <a href="#Enviroment">Environment</a> (check API for more
          details on constructor parameters):
          <pre
            style="
              text-align: left;
              color: white;
              background: #494949;
              margin-right: 40px;
            "
          >
                &lt;script&gt;
                const env1 = new Enviroment("env1", 300, 600, "White", 0, 200)
                env1.createEnviroment()
                &lt;/script&gt;
              </pre
          >
        </li>
        <li>
          Creating a <a href="#Matter">Matter</a> (check API for more details on
          constructor parameters), the code below will create a solid,
          optionally, createLiquid(), and createGas() could be called to create
          a liquid or a gas respectively:
          <pre
            style="
              text-align: left;
              color: white;
              background: #494949;
              margin-right: 40px;
            "
          >
                &lt;script&gt;
                const env1_solid1 = new Matter(env1, 200, 40, 200.1, 100, 'Orange', 100, false, true, "sand1")
                env1_solid1.createSolid()
                &lt;/script&gt;
              </pre
          >
        </li>
        <li>
          Creating a <a href="#EnviromentController">EnviromentController</a>:
          <pre
            style="
              text-align: left;
              color: white;
              background: #494949;
              margin-right: 40px;
            "
          >
                &lt;script&gt;
                new EnviromentController(env4).create()
                &lt;/script&gt;
              </pre
          >
        </li>
      </ul>
