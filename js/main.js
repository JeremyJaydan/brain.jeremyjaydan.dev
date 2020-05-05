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

  $("canvas").springy({graph});

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
          }
          nodeInput.focus();
        }else{
          if(currentSubject){
            currentSubject.data.label = label;
          }else{
            currentSubject = graph.newNode({label, onNodeClick, ondoubleclick});
          }
        }
      }
    },
    node: function(e){
      const label = e.target.value;
      if(e.key === "Enter" && currentSubject && label.replace(/\s/g, "") !== ""){
        const newNode = graph.newNode({label, onNodeClick, ondoubleclick});
        graph.newEdge(currentSubject, newNode);
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
      submit.link();
    }
    currentSubject = node;
    subjectInput.value = node.data.label;
    nodeInput.focus();
  }

  function ondoubleclick(node){
    graph.removeNode(node);
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

})();
