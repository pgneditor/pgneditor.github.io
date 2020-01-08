let app = div({id: "app"}).w(200).h(80).bc("#afa")

app.a(div().h(1), div().mar(10).pad(10).bc("#ffa").html("SmartDom"))

console.log(app)

document.getElementById("root").appendChild(app.e)
