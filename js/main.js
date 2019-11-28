const graph = new Springy.Graph();

(function(){

  const canvas = document.querySelector("canvas");
  const inputContainer = document.querySelector(".input");

  resizeCanvas() && window.addEventListener("resize", resizeCanvas);
  function resizeCanvas(){
    canvas.width = window.innerWidth;
    canvas.height = canvas.parentNode.offsetHeight - inputContainer.offsetHeight;
    return true;
  }

  const $storageKey = "brain.jcdn.io";
  const $storage = {
    setItem: function(key, value){
      window.localStorage.setItem($storageKey + "_" + key, value);
    },
    getItem: function(key){
      return window.localStorage.getItem($storageKey + "_" + key);
    }
  };

  $("canvas").springy({graph});

  const $saveGraph = function(graph){
    $storage.setItem("nodes", JSON.stringify(graph.nodes));
    $storage.setItem("edges", JSON.stringify(graph.edges));
  }

  const $findNode = function(nodeId){
    return graph.nodes.filter(function(node){
      return node.id === nodeId
    });
  }

  const $loadGraph = function(graph){
    const nodes = JSON.parse($storage.getItem("nodes") || "[]");
    const edges = JSON.parse($storage.getItem("edges") || "[]");
    if(nodes.length > 0 || edges.length > 0){
      $hideUsage();
    }
    $for(nodes, function(node, {next}){
      graph.newNode({
        label: node.data.label,
        onNodeClick,
        ondoubleclick
      })
      next();
    }, {interval: 100})
    .then(function(){
      $for(edges, function(edge, {next}){
        const e1 = $findNode(edge.source.id)[0];
        const e2 = $findNode(edge.target.id)[0];
        graph.newEdge(e1, e2);
        next();
      }, {interval: 50})
    });
  }

  let initialSubmission = true;
  let currentSubject;
  let isLinking = false;
  let currentMode;
  const submit = {
    subject: function(e){
      const label = e.target.value;
      if(label.replace(/\s/g, "") !== ""){
        if(e.key === "Enter"){
          if(initialSubmission){
            document.querySelector("canvas").click();
            initialSubmission = false;
            $saveGraph(graph);
          }
          nodeInput.focus();
        }else{
          if(currentSubject){
            currentSubject.data.label = label;
          }else{
            currentSubject = graph.newNode({label, onNodeClick, ondoubleclick});
            $saveGraph(graph);
          }
        }
      }
    },
    node: function(e){
      const label = e.target.value;
      if(e.key === "Enter" && currentSubject && label.replace(/\s/g, "") !== ""){
        const newNode = graph.newNode({label, onNodeClick, ondoubleclick});
        console.log({currentSubject, newNode});
        graph.newEdge(currentSubject, newNode);
        $saveGraph(graph);
        e.target.value = "";
        if(currentMode === "R"){
          currentSubject = newNode;
          subjectInput.value = label;
        }
      }else{
        if(initialSubmission){
          document.querySelector("canvas").click();
          initialSubmission = false;
        }
      }
    },
    link: function(){
      linkButton.classList.toggle("active");
      isLinking = !isLinking;
    },
    mode: function(){
      if(currentMode === "B"){
        currentMode = "R";
      }else{
        currentMode = "B";
      }
      inputContainer.classList.toggle("mode--B");
      inputContainer.classList.toggle("mode--R");
      modeButton.innerText = currentMode;
    }
  }

  function onNodeClick(node){
    if(isLinking && currentSubject){
      graph.newEdge(currentSubject, node);
      $saveGraph(graph);
      submit.link();
    }
    currentSubject = node;
    subjectInput.value = node.data.label;
    nodeInput.focus();
  }

  function ondoubleclick(node){
    graph.removeNode(node);
    $saveGraph(graph);
    currentSubject = null;
    subjectInput.value = "";
    subjectInput.focus();
  }

  const subjectInput = document.querySelector("#input-subject");
  const nodeInput = document.querySelector("#input-node");
  const linkButton = document.querySelector("#button-link");
  const modeButton = document.querySelector("#button-mode");
  subjectInput.addEventListener("keyup", submit.subject);
  nodeInput.addEventListener("keyup", submit.node);
  linkButton.addEventListener("click", submit.link);
  modeButton.addEventListener("click", submit.mode);
  subjectInput.focus();
  currentMode = modeButton.innerText;

  const $usageContainer = document.querySelector(".js--usage-container");
  const $hideUsage = function(){
    $usageContainer.remove();
  };
  document.querySelector(".usage__text--hide").addEventListener("click", $hideUsage);
  $loadGraph(graph);

})();
