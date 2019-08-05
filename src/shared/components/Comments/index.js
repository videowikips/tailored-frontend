import React, { Component } from 'react'
import Avatar from 'react-avatar';
import { Input } from 'semantic-ui-react'

export default class index extends Component {
    render() {
        return (
            <div className="comment-section">

                <div class="comment">
                    <div class="right">
                        <Avatar src="https://i.pravatar.cc/?u=asdg" className="avatar" name="Foo Bar" />
                    </div>

                    <div className="user-suggestions">
                        <div className="suggestion">
                            <Avatar src="https://i.pravatar.cc/?u=21412" className="avatar" name="Foo Bar" />
                            <div>John Doe</div>
                        </div>

                        <div className="suggestion">
                            <Avatar src="https://i.pravatar.cc/?u=fay" className="avatar" name="Foo Bar" />
                            <div>Ann Dias</div>
                        </div>

                        <div className="suggestion">
                            <Avatar src="https://i.pravatar.cc/?u=464fg" className="avatar" name="Foo Bar" />
                            <div>Shanil Arjuna</div>
                        </div>

                    </div>

                    <div class="left">
                        <Input fluid type="text" placeholder="Add a comment" />
                    </div>

                </div>

                <div class="comment">
                    <div class="right">
                        <Avatar src="https://i.pravatar.cc/?u=4635" className="avatar" name="Foo Bar" />
                    </div>
                    <div class="left">
                        <div className="comment-text">
                            Lorem ipsum dolor sit amet consectetur adipisicing elit.
                            Culpa voluptatem modi laborum, quasi ullam officiis
                            inventore ipsam accusamus repellat veritatis fugiat
                            consectetur, est nemo? Corrupti culpa nulla unde sint deleniti.
                        </div>
                    </div>
                </div>

                <div class="comment">
                    <div class="right">
                        <Avatar src="https://i.pravatar.cc/?u=62gf" className="avatar" name="Foo Bar" />
                    </div>
                    <div class="left">
                        <div className="comment-text">
                            Lorem ipsum dolor sit amet consectetur adipisicing elit.
                            Culpa voluptatem modi laborum, quasi ullam officiis
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
