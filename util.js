function notify(title, body) {
    Notification.requestPermission().then(perm => {
      if(perm === 'granted') {
        let notif = new Notification(title, {
          body: body,
  
        })
      }
    })
  }